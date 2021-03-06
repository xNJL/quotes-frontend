import React, {ChangeEvent, useState} from "react";
import {
    Button, Card,
    CardActions,
    CardContent,
    Chip,
    IconButton,
    makeStyles,
    Snackbar,
    TextField,
    Typography
} from "@material-ui/core";
import useWindowDimensions from "../hooks/useWindowDimensions";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import MuiAlert from "@material-ui/lab/Alert";
import SaveIcon from "@material-ui/icons/Save";
import { RouteComponentProps, withRouter } from 'react-router';

const useStyles = makeStyles(() => ({
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: 'stretch',
    },
    fieldTitle: {
        marginTop: "20px"
    },
    tagEditor: {
        display: "flex",
        flexWrap: "wrap",

        alignItems: "flex-end",
        justifyContent: "flex-start",

    },
    addTag: {
        display: "flex",
        alignItems: "flex-end",
    },
    tagItem: {
        margin: "0 3px"
    }
}))

const AddQuote = ({history}: RouteComponentProps) => {
    const width = useWindowDimensions().width;
    const styles = useStyles();

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarText, setSnackBarText] = useState("");

    const [currentText, setCurrentText] = useState("");
    const [currentAuthor, setCurrentAuthor] = useState("");
    const [currentBook, setCurrentBook] = useState("");
    const [currentTags, setCurrentTags] = useState(Array<string>());
    const [currentNewTag, setCurrentNewTag] = useState('');


    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, func: Function) {
        if (event.target !== undefined) {
            func(event.currentTarget.value)
        }
    }

    async function submitEdit() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                text: currentText,
                author: currentAuthor,
                book: currentBook,
                tags: currentTags
            })
        };
        await fetch('/quote/0', requestOptions)
            .then(response => {
                // TODO Handle error
                if(response.ok) {
                    history.push('/');
                }else{
                    console.log("failed");
                }
            });
    }

    const handleCloseSnackBar = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setSnackBarOpen(false);
        setSnackBarText("");
    };

    const handleAddIcon = () => {
        if (currentTags.indexOf(currentNewTag) > -1) {
            setSnackBarText("The tag you are trying to add already exists");
            setSnackBarOpen(true);
            setCurrentNewTag("");
            return;
        }
        if (currentNewTag.length === 0){
            setSnackBarText("The tag cannot be empty");
            setSnackBarOpen(true);
            return;
        }
        setCurrentTags(currentTags.concat([currentNewTag]));
        setCurrentNewTag("");
    }

    const handleDelete = (tag: string) => {
        setCurrentTags(currentTags.filter(tagName => tagName !== tag))
    }

    return (
        <Card style={{margin: width < 500 ? "5px" : "30px"}}>
            <CardContent>
                <form className={styles.form}>
                    <Typography variant={"body1"} className={styles.fieldTitle}>Text</Typography>
                    <TextField
                        multiline
                        rowsMax={4}
                        id="quote-edit-text"
                        value={currentText}
                        onChange={(event) => handleChange(event, setCurrentText)}
                    />
                    <Typography variant={"body1"} className={styles.fieldTitle}>Author</Typography>
                    <TextField
                        id="quote-edit-author"
                        value={currentAuthor}
                        onChange={(event) => handleChange(event, setCurrentAuthor)}
                    />
                    <Typography variant={"body1"} className={styles.fieldTitle}>Book</Typography>
                    <TextField
                        id="quote-edit-book"
                        value={currentBook}
                        onChange={(event) => handleChange(event, setCurrentBook)}
                    />
                    <Typography variant={"body1"} className={styles.fieldTitle}>Tags</Typography>
                    <div className={styles.tagEditor}>
                        {currentTags.map(tag => (
                            <Chip key={tag} label={tag} className={styles.tagItem} onDelete={() => handleDelete(tag)}
                                  color="primary"/>
                        ))}
                        <div className={styles.addTag}>
                            <TextField
                                id="quote-edit-tag"
                                label="Add tag"
                                placeholder={"science, philosophy, ..."}
                                value={currentNewTag}
                                onChange={e => setCurrentNewTag(e.target.value)}
                            />
                            <IconButton aria-label="add" size="small" onClick={handleAddIcon}>
                                <AddCircleRoundedIcon fontSize="default"/>
                            </IconButton>
                        </div>
                        <Snackbar open={snackBarOpen} autoHideDuration={3000} onClose={handleCloseSnackBar}>
                            <MuiAlert elevation={6} variant="filled" severity={"error"} onClose={handleCloseSnackBar}>
                                {snackBarText}
                            </MuiAlert>
                        </Snackbar>
                    </div>
                </form>
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={submitEdit}
                >
                    Submit
                </Button>
            </CardActions>
        </Card>
    )
}


export default withRouter(AddQuote);