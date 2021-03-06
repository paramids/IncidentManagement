import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import { useSelector, useDispatch } from 'react-redux';
import draftToHtml from 'draftjs-to-html';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

import { submitIncidentComment } from '../../state/OngoingIncidents.actions'

import '../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const styles = theme => ({
    editorWrapper: {
        minHeight: 250,
        border: 'solid #e0e0e0',
        padding: 10
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 40,
        paddingTop: 10
    },
});


const postComment = (incidentId, editorState, isOutcome, dispatch) => {
    let commentBody = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    let commentObj = {
        incident: incidentId,
        comment: commentBody,
        isOutcome: isOutcome
    }
    return dispatch(submitIncidentComment(incidentId, commentObj))
}

const EditorComponent = (props) => {

    const initialEditorState = EditorState.createEmpty()
    const [editorState, setEditorState] = useState(initialEditorState)
    const [isOutcome, setIsOutcome] = useState(false)
    const activeIncidentId = useSelector((state) => (state.sharedReducer.activeIncident.data.id))
    const dispatch = useDispatch()

    const { classes } = props





    const toolBar = {
        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign'],
        inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
        },
        blockType: {
            inDropdown: true,
            options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
        },
        textAlign: {
            inDropdown: true,
            options: ['left', 'center', 'right', 'justify'],
        }

    }

    return (
        <>
            <div className={classes.editorWrapper}>
                <Editor
                    toolbar={toolBar}
                    editorState={editorState}
                    onEditorStateChange={(newState, callback) => { setEditorState(newState) }}
                    placeholder="Type your comment here."
                    toolbarCustomButtons={[<MarkAsOutComeSelect isOutcome={isOutcome} setIsOutcome={setIsOutcome}/>]}
                />
            </div>

            <div className={classes.actionsWrapper}>
                {/* <FormControlLabel
                    control={
                        <Switch
                            checked={isOutcome}
                            onChange={() => { setIsOutcome(!isOutcome) }}
                            value="isOutcome"
                            color="primary"
                        />
                    }
                    label="Mark as Outcome"
                /> */}
                <div></div>
                <Button
                    variant="contained"
                    onClick={() => {
                        postComment(activeIncidentId, editorState, isOutcome, dispatch)
                        setEditorState(initialEditorState)
                    }}>
                    Post
                </Button>
            </div>
        </>
    )
}


const MarkAsOutComeSelect = (props) => {
    return (
        <FormControlLabel
            style={{marginLeft:10}}
            label="Incident Resolution"
            control={
                <Switch
                    checked={props.isOutcome}
                    onChange={() => { props.setIsOutcome(!props.isOutcome) }}
                    value="isOutcome"
                    color="primary"
                />
            }
        />
    );
}

export default withStyles(styles)(EditorComponent)