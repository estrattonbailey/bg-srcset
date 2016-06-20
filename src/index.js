/**
 * Lazy load, 
 * should set class to element too
 */
function setBg(images, style, bg){
  /**
   * The best image for the current
   * viewport size
   */
  let size

  /**
   * URLs of images, 
   * smallest to largest
   */
  let urls = []

  /**
   * Breakpoints of images, 
   * smallest to largest
   */
  let sizes = []

  /**
   * Width of container
   */
  let containerWidth = bg.offsetWidth

  /**
   * Dummy image to load
   */
  let image = new Image()

  /**
   * Set handling after load
   */
  image.onload = function(){
    bg.parentNode.insertBefore(style, bg);
    setTimeout(() => {bg.classList.add('is-loaded')}, 0)
  };

  for (var i = 0; i < images.length; i++){
    var img = images[i].split(/\s/);
    urls.push(img[0])         
    sizes.push(parseInt(img[1] || 0))         
  }

  /**
   * Apply smallest size by default
   */
  size = Math.min.apply(null, sizes);

  /**
   * Find correct size for container width
   */
  for (var i = 0; i < sizes.length; i++){
    if (containerWidth > sizes[i]) size = sizes[i+1] ? i+1 : i;
  }
  
  image.src = urls[size];
}

/**
 * Write CSS
 */
function generateStyle(images){
  var css = '',
      node = document.createElement('style');

  for (var i = 0; i < images.length; i++){  
    var image = images[i].split(/\s/);
    if (image[1]){
      css 
        +='@media (min-width: '+image[1]+'px){'
          +'[data-src] { background-image: url("'+image[0]+'")}'
        +'}'
    } else {
      css += '[data-src] { background-image: url("'+image[0]+'")}'
    }
  }
  
  node.innerHTML = css;
  return node;
}

export default function(sel){
  sel = sel || 'data-src'

  const bgs = [].slice.call(document.querySelectorAll(`[${sel}]`));
  
  bgs.forEach((bg) => {
    let images = bg.getAttribute(sel).split(/\,\s|\,/)
    let style = generateStyle(images)
    
    setBg(images, style, bg)
  })
}
