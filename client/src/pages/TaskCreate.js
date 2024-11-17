import { Box } from "@mui/material"
import { Container } from "@mui/system"
import Taskform from "../components/Taskform"
import Header from "./Header"
const TaskCreate = () => {
    return(
    <Box>
        <Header />
        <Container>
            <Taskform mode="create" />
        </Container>
    </Box>)
}

export default TaskCreate