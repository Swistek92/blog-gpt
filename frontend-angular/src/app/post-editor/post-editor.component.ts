import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms'; // konieczne do ngModel

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [QuillModule, FormsModule],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent {
  postContent: string = '';

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  submitPost() {
    console.log('Post content:', this.postContent);
  }
}
