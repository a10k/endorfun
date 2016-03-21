var beginTime = new Date();
var audio = new Audio('sound.mp3');
    audio.volume = 0;
var audioFlag = false;
var toggleAudio = function(){
  $('.volumeControl').toggleClass('on');
  if (audioFlag) {
    audio.volume = 0;
    audioFlag = false;
  } else {
    audio.volume = 0.01;
    audioFlag = true;
  }
};


var scene, camera, renderer, threejs;
var gui = null;
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
var mesh, color;
var de2ra = function(degree) { return degree*(Math.PI/180);};
var faceColorArray = [0x66FF33,0xFF66CC,0x6633FF,0x00d6ba,0xF00000,0xFFE706];
var cssColor = ["#66FF33","#FF66CC","#6633FF","#00d6ba","#F00000","#FFE706"];

$(document).ready(function(){
  init();
  animate();

  function init() {
    threejs = document.getElementById('endorfun');
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    threejs.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(25, WIDTH / HEIGHT, 1 , 2000);
    camera.position.set(15, 19, 30);
    camera.lookAt(scene.position);
    scene.add(camera);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    color = 0xffffff;
    for ( var i = 0; i < geometry.faces.length; i ++ ) {
      if(i % 2 === 0){
        var faceColor = faceColorArray[i/2];
        geometry.faces[ i ].color.setHex(faceColor);
        geometry.faces[ i + 1 ].color.setHex(faceColor);
      }
    }
    var material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      vertexColors: THREE.FaceColors
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0, 0);
    mesh.rotation.y = de2ra(0);
    mesh.scale.set(1, 1, 1);
    mesh.doubleSided = true;
    mesh.castShadow = true;
    scene.add(mesh);

    var planeGeometry = new THREE.BoxGeometry( 15, 15, 0.1 );
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      map: THREE.ImageUtils.loadTexture( "texture.svg" )
    });
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0, -0.55, 0);
    planeMesh.rotation.set(0, 0, 0);
    planeMesh.rotation.x = de2ra(90);
    planeMesh.receiveShadow = true;
    scene.add(planeMesh);

    //puzzle block
    var puzzleGeometry = new THREE.BoxGeometry( 1, 0.1, 1 );
    var puzzleMaterial = new THREE.MeshPhongMaterial({
      color: faceColorArray[0],
      side: THREE.DoubleSide
    });
    puzzleMesh = new THREE.Mesh(puzzleGeometry, puzzleMaterial);
    puzzleMesh.position.set(4, -0.45, 2);
    puzzleMesh.doubleSided = true;
    puzzleMesh.castShadow = true;
    scene.add(puzzleMesh);


    light = new THREE.HemisphereLight(0xffffff, 0xffffff, .7);
    shadowLight = new THREE.DirectionalLight(0xffffff, .5);
    shadowLight.position.set(200, 200, 200);
    backLight = new THREE.DirectionalLight(0xffffff, .4);
    backLight.position.set(-500, 500, -500);
    
    scene.add(light);
    scene.add(backLight);
    scene.add(shadowLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    window.addEventListener( 'resize', onWindowResize, false );
  }

  function dec2hex(i) {
    var result = "0x000000";
    if (i >= 0 && i <= 15) { result = "0x00000" + i.toString(16); }
    else if (i >= 16 && i <= 255) { result = "0x0000" + i.toString(16); }
    else if (i >= 256 && i <= 4095) { result = "0x000" + i.toString(16); }
    else if (i >= 4096 && i <= 65535) { result = "0x00" + i.toString(16); }
    else if (i >= 65535 && i <= 1048575) { result = "0x0" + i.toString(16); }
    else if (i >= 1048575 ) { result = '0x' + i.toString(16); }
  if (result.length == 8){return result;}
   
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight/ 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderScene();
    TWEEN.update();
  }

  function renderScene(){
    renderer.render(scene, camera);
  }

});


//Puzzle block tween
var puzzleTweenDuration = 600;
var puzzleTween = new TWEEN.Tween({tmp:0.99}).to({tmp:0.6}, puzzleTweenDuration);
var puzzleTweenUpdate = function(){
  puzzleMesh.scale.z = this.tmp;
  puzzleMesh.scale.x = this.tmp;
}
puzzleTween.onUpdate(puzzleTweenUpdate);
puzzleTween.repeat(Infinity);
puzzleTween.yoyo(true);
puzzleTween.start();