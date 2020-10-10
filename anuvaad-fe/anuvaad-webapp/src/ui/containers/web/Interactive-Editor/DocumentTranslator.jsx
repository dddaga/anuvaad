import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import SourceView from "./DocumentSource";
import Grid from "@material-ui/core/Grid";
import ClearContent from "../../../../flux/actions/apis/clearcontent";
import MachineTranslation from "./MachineTranslation";
import Block from "./Block";
import Spinner from "../../../components/web/common/Spinner";
import Paper from "@material-ui/core/Paper";
import Fab from '@material-ui/core/Fab';
import Merge from "@material-ui/icons/CallMerge";
import Snackbar from "../../../components/web/common/Snackbar";
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "../../../components/web/common/SimpleDialog";
import BLOCK_OPS from "../../../../utils/block.operations";

const TELEMETRY = require("../../../../utils/TelemetryManager");

class PdfFileEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  

  handleSentenceClick(value) {
    this.setState({ activeSentence: value })
  }

  handleClick=(value)=>{
      console.log("value----",value)
    this.setState({buttonStatus : value})
  }

  handleClose = () => {
    
    this.setState({
      openDialog: false,
      start_block_id:"",
      start_sentence_id:'',
      end_sentence_id:'',
      operation_type: "",
    });
  };
  handleDialogMessage = (start_block_id, start_sentence_id, end_sentence_id,subString, event,operation, message) => {
    // let splitValue = this.handleSplitSentence(subString)
    
    debugger
    this.setState({
      operation_type: operation,
      openDialog: true,
      message : message,
      title:operation,
      topValue: event.clientY - 4,
      leftValue: event.clientX - 2,
      selectedBlock: null,
      start_block_id,
      start_sentence_id,
      end_sentence_id



    });
  };

  handleDialog() {
    let workflowCode = "DP_WFLOW_S_TR";
    if (this.state.title === "Merge sentence") {
     let updatedBlocks =   BLOCK_OPS.do_sentences_merging(this.props.sentences,this.state.start_block_id, this.state.start_sentence_id, this.state.end_sentence_id);
    this.props.workFlowApi(workflowCode, [updatedBlocks], this.state.title);
     
    }
    else if(this.state.title === "Split sentence" ){
      let updatedBlocks =   BLOCK_OPS.do_sentence_splitting(this.props.sentences,this.state.start_block_id, this.state.start_sentence_id, this.state.end_sentence_id);
      this.props.workFlowApi(workflowCode, [updatedBlocks], this.state.title);
    }
    
    this.setState({ openDialog: false });
  }

  
  

  handleSentence = () => {
    let sentenceArray = [];
    this.props.sentences.map((element) => {
      element.text_blocks.map((sentence) => {
        sentence.tokenized_sentences.map((value, tokenIndex) => {
          sentenceArray.push(
            <Block 
            handleDialogMessage = {this.handleDialogMessage.bind(this)}
            sentence={value} 
            handleClick ={this.handleClick.bind(this)} buttonStatus ={this.state.buttonStatus}
            pageNo={element.page_no}
            selectedBlock={this.state.activeSentence} 
            handleSentenceClick={this.handleSentenceClick.bind(this)}
            handleSourceChange = {this.props.handleSourceChange}
            tokenIndex = {this.props.tokenIndex}
            showTargetData = { this.showTargetData.bind(this)}
            selectedTargetId = {this.state.selectedTargetId}
            // blockIdentifier = {}
           />
          );
        });
      });
    });
    return sentenceArray;
  };

  handleBlur(id, finalValue, wc_code) {

  }

  handleMe(value){
      this.setState({mergeButton:value})
  }

  showTargetData(blockId) {
    this.setState({ selectedTargetId: blockId })
  }

  render() {
    return (
      <div>
        {this.props.sentences && (
          <div>
            <Grid
              container
              spacing={2}
              style={{
                marginTop: "-20px",
                padding: "5px 24px 0px ",
                width: "100%",
                position: "fixed",
                zIndex: 1000,
                background: "#F5F9FA",
              }}
            >
              <Grid item xs={12} sm={9} lg={9} xl={9}>
              {this.state.buttonStatus === "merge" &&
              <Toolbar >
              
                  
          <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
              <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"

          onClick={() => this.handleClick("")}
        >
          <CancelIcon />
          Cancel
        </Fab>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          onClick={() => this.handleClick("mergeSaved")}
        >
          <Merge />
          Merge
        </Fab></Toolbar>}
                <div elevation={3} style={{ overflow: "auto" }}>
                  <div
                    id="scrollableDiv"
                    style={{
                      maxHeight: window.innerHeight - 220,
                      overflowY: "auto"
                    }}
                  >
                    {this.handleSentence()}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Grid item xs={12} sm={12} lg={12} xl={12} style={{height: "50%"}}>
                  <MachineTranslation sentence={this.state.activeSentence} buttonStatus ={this.state.buttonStatus}/>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              style={{ padding: "12px 24px 0px 24px" }}
            >
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper></Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper></Paper>
              </Grid>
            </Grid>
          </div>
        )}

{this.state.openDialog && (
          <Dialog
            message={this.state.dialogMessage}
            handleSubmit={this.handleDialog.bind(this)}
            handleClose={this.handleClose.bind(this)}
            open
            title={this.state.title}
          />
        )}

        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            variant="success"
            message={this.state.message}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchPdfSentence: state.fetchPdfSentence,
  fileUpload: state.fileUpload,
  documentDetails: state.documentDetails,
  fetchContent: state.fetchContent,
  workflowStatus: state.workflowStatus,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport,
      ClearContent: ClearContent,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PdfFileEditor)
);
