export const lockScroll = () => {
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

export const unlockScroll = () => {
  document.body.style.position = "";
  document.body.style.width = "";
};
