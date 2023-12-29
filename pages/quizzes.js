import { useState } from "react";
import {
    Box,
    Flex,
    Tag,
    IconButton,
    Heading,
    Text,
    Avatar,
    HStack,
    Tooltip,
} from "@chakra-ui/react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { GrAdd } from "react-icons/gr";
import { useRouter } from "next/router";
import { enrollToQuiz } from "../services/quiz";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import ConfirmDialog from "../components/common/ConfirmDialog";

function isEnrolled(allUsersEnrolled, currentUserId) {
    var status = false;
    for (let i = 0; i < allUsersEnrolled.length; i++) {
        if (allUsersEnrolled[i].userId === currentUserId) {
            status = true;
        } else {
            status = false;
        }
    }
    return status;
}

const fetcher = (url) => axios.get(url).then((resp) => resp.data);

const Quizes = () => {
    const { data: session } = useSession();

    const { data: quizzes } = useSWR("/api/quiz", fetcher);

    return (
        <Box px={8}>
            <Navbar />
            <Heading py={5}>Quizzas</Heading>
            <Card>
                {quizzes?.length === 0 ? (
                    <Text>
                        {session?.user?.role === "Administrator"
                            ? "No quizzes yet, Create some yoo!"
                            : "There no quizzes contact Admin!"}
                    </Text>
                ) : (
                    <Box>
                        {quizzes?.map((quiz) => (
                            <QuizItem
                                key={quiz?._id}
                                quiz={quiz}
                                user={session?.user}
                            />
                        ))}
                    </Box>
                )}
            </Card>
        </Box>
    );
};

const QuizItem = ({ quiz, user }) => {
    const router = useRouter();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const enroll = () => {
        enrollToQuiz(quiz._id, user.id).then((data) => {
            setLoading(false);
            setShowConfirmModal(false);
        });
    };

    return (
        <Box mb={6}>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar size="xl" mr={5} src={quiz?.image} />
                    {/* To add a push state */}
                    <Text
                        fontSize={"3xl"}
                        _hover={{
                            borderBottom: "2px solid #4299E1",
                        }}
                        cursor={"pointer"}
                        onClick={() =>
                            user.role === "Administrator"
                                ? router.push({
                                      pathname: "/quiz_detail",
                                      query: { quizId: quiz?._id },
                                  })
                                : {}
                        }
                    >
                        {quiz?.title}
                    </Text>
                </Flex>
                <Tag
                    display={{ base: "none", lg: "flex" }}
                    bg={"teal.400"}
                    variant="subtle"
                    size="lg"
                    borderRadius={"full"}
                >
                    {quiz?.description}
                </Tag>
                <HStack spacing={4}>
                    <Tooltip
                        label={
                            isEnrolled(quiz.usersEnrolled, user?.id)
                                ? "Already enrolled"
                                : "Enroll to Quiz"
                        }
                        hasArrow
                        placement={"top"}
                        bg={"teal"}
                    >
                        <IconButton
                            size={"md"}
                            icon={<GrAdd />}
                            isRound
                            bg={"gray.300"}
                            onClick={() => setShowConfirmModal(true)}
                            disabled={isEnrolled(quiz.usersEnrolled, user?.id)}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
            <br />
            <hr
                style={{
                    backgroundColor: "#CBD5E0",
                    color: "#CBD5E0",
                    height: 2,
                }}
            />
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={setShowConfirmModal}
                title={"Enroll to Quiz"}
                description={`Are you sure you want to enroll to ${quiz?.title} quiz`}
                isLoading={loading}
                loadingText={"Enrolling"}
                onClickConfirm={enroll}
            />
        </Box>
    );
};

export default Quizes;
