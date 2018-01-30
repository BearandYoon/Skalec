import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { FileUpload } from '../interfaces/file-upload';
import {async} from 'rxjs/scheduler/async';

@Injectable()
export class UploadFileService {

  constructor(
    private db: AngularFireDatabase,
    private afs: AngularFirestore
  ) {}

  private basePath = '/uploads';

  pushFileToStorage(fileUpload: FileUpload, progress: {percentage: number}) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (error) => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = fileUpload.file.name;
        console.log('------', fileUpload);
        // this.saveFileData(fileUpload);
      }
    );
  }

  async saveFileData(fileUpload: FileUpload) {
    await this.db.list(`reservations/`).push(fileUpload);
  }
}
