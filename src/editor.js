import { marked } from 'marked';

class LifecycleEditor {
  constructor() {
    this.template = document.getElementById('lifecycle-template').innerHTML;
    this.preview = document.getElementById('preview');
  }
  
  render(md) {
    this.preview.innerHTML = marked(md);
  }
}
