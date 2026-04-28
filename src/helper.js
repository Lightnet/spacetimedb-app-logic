
export function generateName(length = 12) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    // Clear the previous timer if the function is called again
    clearTimeout(timer); 
    // Start a new timer
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
// function updateMessageScroll(){}
// const scrollMessages = debounce(updateMessageScroll, 100);

class OnDetach extends HTMLElement {
  constructor(callback) {
    super();
    this.onDetach = callback;
  }
  disconnectedCallback() {
    if (this.onDetach) this.onDetach();
  }
}
customElements.define("on-detach", OnDetach);
console.log(HTMLElement);
console.log(customElements);

// Helper function
export const onDetach = (callback) => new OnDetach(callback);