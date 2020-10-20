import { Component, AfterContentInit } from '@angular/core';
import { ComService } from '../com/com.service';
import Peer from 'peerjs';
// declare var Peer: any;

interface meta {
  id;
  displayname;
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements AfterContentInit {
  constructor(private com: ComService) {}

  callState: boolean = false;
  peer: Peer;

  userID: string = '----';
  displayName: string = '----';

  userDialog;
  callerDialog;
  callingDialog;
  answerDialog;

  myStream;

  outGoingID;

  incomingID;

  currentCall: Peer.MediaConnection;
  currentCallerStream;

  callingCanvas;

  setUserData() {
    this.peer = new Peer(this.userID, {
      host: 'peerserver-itvalleys.herokuapp.com',
      port: 80,
      path: '/peer-endpoint',
    });
    console.log('setted');
    this.setAnswerCalls();
  }

  close() {
    if (this.userID.length > 0) {
      this.setUserData();
      this.userDialog.hide();
      this.setMeta();
    }
  }

  getIDandName() {
    this.userDialog.show();

    const id: any = document.querySelector('.sl-input-id');
    id.addEventListener('slInput', () => {
      this.userID = id.value;
    });

    const displayname: any = document.querySelector('.sl-input-display-name');
    displayname.addEventListener('slInput', () => {
      this.displayName = displayname.value;
    });
  }

  copy() {
    var input = document.createElement('input');
    input.setAttribute('value', this.userID);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

  setMeta() {
    let metaData = {
      id: this.userID,
      displayname: this.displayName,
    };

    let jsonMeta = JSON.stringify(metaData);
    localStorage.setItem('user', jsonMeta);
  }

  meta() {
    let metaData = localStorage.getItem('user');

    if (metaData == null) {
      return false;
    }

    this.callingCanvas = document.querySelector('.onCall');

    let userData: meta = JSON.parse(metaData);
    this.userID = userData.id;
    this.displayName = userData.displayname;

    this.setUserData();

    return true;
  }
  setDialogues() {
    this.userDialog = document.querySelector('.user-dialog');
    this.userDialog.addEventListener('slOverlayDismiss', (event) =>
      event.preventDefault()
    );
    this.callerDialog = document.querySelector('.caller-dialog');
    this.callerDialog.addEventListener('slOverlayDismiss', (event) =>
      event.preventDefault()
    );
    this.callingDialog = document.querySelector('.outgoing-caller-dialog');
    this.callingDialog.addEventListener('slOverlayDismiss', (event) =>
      event.preventDefault()
    );
    this.answerDialog = document.querySelector('.incoming-caller-dialog');
    this.answerDialog.addEventListener('slOverlayDismiss', (event) =>
      event.preventDefault()
    );
  }

  async setMyStream() {
    this.myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }

  addStreams() {
    let caller: HTMLVideoElement = document.querySelector('.caller');
    let receiver: HTMLVideoElement = document.querySelector('.receiver');

    caller.srcObject = this.currentCallerStream;
    receiver.srcObject = this.myStream;

    caller.addEventListener('loadedmetadata', () => {
      caller.play();
    });

    receiver.addEventListener('loadedmetadata', () => {
      receiver.muted = true;
      receiver.play();
    });
  }

  answerCall() {
    this.callState = true;
    this.answerDialog.hide();
    this.currentCall.answer(this.myStream);

    this.currentCall.on('stream', (callerStream) => {
      this.currentCallerStream = callerStream;
      this.addStreams();
    });
  }

  setAnswerCalls() {
    this.peer.on('call', (call) => {
      this.currentCall = call;
      this.incomingID = call.peer;
      this.answerDialog.show();
    });
  }

  ngAfterContentInit(): void {
    this.setDialogues();
    this.setMyStream();
    if (!this.meta()) {
      this.getIDandName();
    }
  }

  makeCall() {
    this.callerDialog.hide();
    this.currentCall = this.peer.call(this.outGoingID, this.myStream);
    this.callingDialog.show();
    this.callState = true;

    this.currentCall.on('stream', (callerStream) => {
      this.currentCallerStream = callerStream;
      this.callingDialog.hide();
      this.addStreams();
    });
  }

  call() {
    let idInput: any = document.querySelector('.call-user-id');

    idInput.addEventListener('slInput', () => {
      this.outGoingID = idInput.value;
    });
    this.callerDialog.show();
  }
}
