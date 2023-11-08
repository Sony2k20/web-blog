import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.sass'],
})
export class PostDashboardComponent implements OnInit {
  progressbarValue: number | undefined = 0;
  imageUrl?: Observable<any>;
  image: any;
  newImage: string | undefined;
  file: any;
  filePath: string | undefined;
  post: Post | undefined;
  id: any;

  reviewTypes = {
    Anime: 'animes',
    Filme: 'movies',
    Serien: 'series',
    Spiele: 'games',
  };

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    longTitle: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    id: new FormControl('', Validators.required),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    image: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
  });

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private storage: AngularFireStorage,
    private snackbarService: SnackbarComponent,
    private dialogRef: MatDialogRef<PostDashboardComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.changeType === 'edit') {
      this.formGroup.controls['title'].disable();
      this.formGroup.controls['title'].setValue(this.data.post.title);
      this.formGroup.controls['longTitle'].setValue(this.data.post.longTitle);
      this.formGroup.controls['type'].setValue(this.data.post.type);
      this.formGroup.controls['content'].setValue(this.data.post.content);
      this.formGroup.controls['image'].setValue(this.data.post.image);
      this.formGroup.controls['id'].setValue(this.data.post.id);
      this.replaceBR();
      this.newImage = 'no';
    }
  }

  async createPostBody() {
    if (
      (await this.postService.countPostsbyType(
        'title',
        this.formGroup?.get('title')?.value
      )) === 1 &&
      this.data.changeType !== 'edit'
    ) {
      return this.snackbarService.openSnackBar(
        'Titel ist bereits vorhanden',
        '',
        'red-font'
      );
    }

    this.createNewLine();
    this.createID();
    this.id = this.formGroup?.get('id')?.value;

    if (this.formGroup.valid) {
      // this.replaceBR();

      if (this.newImage === 'changed') {
        this.filePath = 'images/' + this.formGroup?.get('id')?.value;
        const fileRef = this.storage.ref(this.filePath);
        const uploadTask = this.storage.upload(this.filePath, this.file);

        uploadTask.percentageChanges().subscribe({
          next: (res) => (this.progressbarValue = res),
          error: () => {},
          complete: () => {},
        });

        uploadTask
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.imageUrl = fileRef.getDownloadURL();
              this.imageUrl?.subscribe((res) => {
                this.formGroup.controls['image'].setValue(res);
                this.post = {
                  title: this.formGroup?.get('title')?.value,
                  longTitle: this.formGroup?.get('longTitle')?.value,
                  content: this.formGroup?.get('content')?.value,
                  image: this.formGroup?.get('image')?.value,
                  type: this.formGroup?.get('type')?.value,
                  published: Timestamp.now(),
                  author: this.auth.getUsername(),
                };
                this.postService.setPost(this.post!, this.id);
                // Add post function
                if (this.data.changeType !== 'edit') {
                  this.snackbarService.openSnackBar(
                    'Beitrag erfolgreich hochgeladen',
                    '',
                    'green-font'
                  );
                  const routerLink =
                    '/blog/' + this.formGroup?.get('id')?.value;
                  setTimeout(() => {
                    window.location.href = routerLink;
                  }, 1000);
                }
              });
            })
          )
          .subscribe();
      } else {
        // Edit post function
        this.post = {
          title: this.formGroup?.get('title')?.value,
          longTitle: this.formGroup?.get('longTitle')?.value,
          content: this.formGroup?.get('content')?.value,
          image: this.formGroup?.get('image')?.value,
          type: this.formGroup?.get('type')?.value,
          published: Timestamp.now(),
        };
        this.postService.setPost(this.post!, this.id);
        this.snackbarService.openSnackBar(
          'Anpassung erfolgreich',
          '',
          'green-font'
        );
      }
    } else {
      this.replaceBR();
      this.snackbarService.openSnackBar(
        'Bitte alle Felder ausfüllen und ein Bild hochladen',
        '',
        'red-font'
      );
    }
  }

  createID() {
    if (!this.formGroup?.get('id')?.value) {
      const newId = this.formGroup?.get('title')?.value;
      return this.formGroup
        ?.get('id')
        ?.setValue(newId.toLowerCase().replace(/ /g, '-'));
    }
  }

  createNewLine() {
    const text = this.formGroup?.get('content')?.value;
    return this.formGroup
      ?.get('content')
      ?.setValue(text.replace(/\n/g, '<br>'));
  }

  replaceBR() {
    const text = this.formGroup?.get('content')?.value;
    return this.formGroup
      ?.get('content')
      ?.setValue(text.replace(/<br>/g, '\n'));
  }

  onSelectFile(event: any) {
    if (event.target.files[0]) {
      this.file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.file);

      reader.onload = (event) => {
        this.image = event.target?.result;
        this.formGroup.controls['image'].setValue('placeholderValue');
        this.newImage = 'changed';
      };
    }
  }

  async uploadContent() {
    this.filePath = 'images/' + this.formGroup?.get('id')?.value;
    const fileRef = this.storage.ref(this.filePath);
    const uploadTask = this.storage.upload(this.filePath, this.file);

    uploadTask.percentageChanges().subscribe({
      next: (res) => (this.progressbarValue = res),
      error: () =>
        this.snackbarService.openSnackBar(
          'Unzureichende Berechtigung',
          '',
          'red-font'
        ),
      complete: () => {
        this.postService.setPost(this.post!, this.id);
        this.snackbarService.openSnackBar(
          'Änderungen erfolgreich',
          '',
          'green-font'
        );
      },
    });

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.imageUrl = fileRef.getDownloadURL();
          this.imageUrl?.subscribe((res) => {
            this.formGroup.controls['image'].setValue(res);
            this.image = res;
          });
        })
      )
      .subscribe();
  }
}
