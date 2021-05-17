export const downFile = (url) => {
  let iframeDownArea = document.getElementById('iframeDownArea');
  if (iframeDownArea) {
    document.body.removeChild(iframeDownArea);
  }
  try {
    if (iframeDownArea) {
      document.body.removeChild(iframeDownArea);
    }
  } catch (e) {
    console.log(e);
  } finally {
    let elemIF = document.createElement('iframe');
    elemIF.id = 'iframeDownArea';
    elemIF.src = url;
    elemIF.style.display = 'none';
    document.body.appendChild(elemIF);
  }
};
