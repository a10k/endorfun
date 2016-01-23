
var controlCube = {
  'currentPosition':[0,0],
  'boundary':{'left':-7,'right':7,'up':-7,'down':7},
  'moveTime':180,
  'lock':false,
  'jump':function(){
    tweenUp = new TWEEN.Tween({tmp:0}).to({tmp:0.28}, this.moveTime/2);
    tweenDown = new TWEEN.Tween({tmp:0.28}).to({tmp:0}, this.moveTime/2);
    tweenUp.onUpdate(function(){
      mesh.position.y = this.tmp;
    });
    tweenDown.onUpdate(function(){
      mesh.position.y = this.tmp;
    });
    tweenUp.start();
    tweenUp.chain(tweenDown);

  },
  'moveRight': function(){
    var last = 0;
    var position = { 
                 x : this.currentPosition[0], 
                 z : this.currentPosition[1],
                 theta : 0
               };
    var target = { 
                x : this.currentPosition[0] + 1,
                z: this.currentPosition[1],
                theta : de2ra(-90)
             };
    if(this.currentPosition[0] == this.boundary.right){return;}
    if(this.lock){return}else{this.lock = true;}
    if(gameCube.turnRight(target) === 0){
    }else{
      this.lock = false;
      return;
    }
    this.currentPosition[0]++;
    this.jump();
    tween = new TWEEN.Tween(position).to(target, this.moveTime);
    tween.onUpdate(function(){
      mesh.position.x = position.x;
      mesh.position.z = position.z;
      
      rotateAroundWorldAxis(mesh,zAxis,position.theta - last);
      last = position.theta;
    });
    tween.start();
    tween.onComplete(function(){controlCube.lock = false;})
  },
  'moveLeft': function(){
    var last = 0;
    var position = { 
                 x : this.currentPosition[0], 
                 z : this.currentPosition[1],
                 theta : 0
               };
    var target = { 
                x : this.currentPosition[0] - 1,
                z: this.currentPosition[1],
                theta : de2ra(90)
             };
    if(this.currentPosition[0] == this.boundary.left){return;}
    if(this.lock){return}else{this.lock = true;}
    if(gameCube.turnLeft(target) === 0){
    }else{
      this.lock = false;
      return;
    }
    this.currentPosition[0]--;
    this.jump();
    tween = new TWEEN.Tween(position).to(target, this.moveTime);
    tween.onUpdate(function(){
      mesh.position.x = position.x;
      mesh.position.z = position.z;
      
      rotateAroundWorldAxis(mesh,zAxis,position.theta - last);
      last = position.theta;
    });
    tween.start();
    tween.onComplete(function(){controlCube.lock = false;})
  },
  'moveDown': function(){
    var last = 0;
    var position = { 
                 x : this.currentPosition[0], 
                 z : this.currentPosition[1],
                 theta : 0
               };
    var target = { 
                x : this.currentPosition[0],
                z: this.currentPosition[1] + 1,
                theta : de2ra(90)
             };
    if(this.currentPosition[1] == this.boundary.down){return;}
    if(this.lock){return}else{this.lock = true;}
    if(gameCube.turnDown(target) === 0){
    }else{
      this.lock = false;
      return;
    }
    this.currentPosition[1]++;
    this.jump();
    tween = new TWEEN.Tween(position).to(target, this.moveTime);
    tween.onUpdate(function(){
      mesh.position.x = position.x;
      mesh.position.z = position.z;
      
      rotateAroundWorldAxis(mesh,xAxis,position.theta - last);
      last = position.theta;
    });
    tween.start();
    tween.onComplete(function(){controlCube.lock = false;})
  },
  'moveUp': function(){
    var last = 0;
    var position = { 
                 x : this.currentPosition[0], 
                 z : this.currentPosition[1],
                 theta : 0
               };
    var target = { 
                x : this.currentPosition[0],
                z: this.currentPosition[1] - 1,
                theta : de2ra(-90)
             };
    if(this.currentPosition[1] == this.boundary.up){return;}
    if(this.lock){return}else{this.lock = true;}
    if(gameCube.turnUp(target) === 0){
    }else{
      this.lock = false;
      return;
    }
    this.currentPosition[1]--;
    this.jump();
    tween = new TWEEN.Tween(position).to(target, this.moveTime);
    tween.onUpdate(function(){
      mesh.position.x = position.x;
      mesh.position.z = position.z;

      rotateAroundWorldAxis(mesh,xAxis,position.theta - last);
      last = position.theta;
    });
    tween.start();
    tween.onComplete(function(){controlCube.lock = false;})
  }
}

var rotWorldMatrix;
var xAxis = new THREE.Vector3(1,0,0);
var yAxis = new THREE.Vector3(0,1,0);
var zAxis = new THREE.Vector3(0,0,1);
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);// pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}

//Arrow key cotrol!
document.onkeydown = function(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        controlCube.moveUp();
    }
    else if (e.keyCode == '40') {
        // down arrow
        controlCube.moveDown();
    }
    else if (e.keyCode == '37') {
       // left arrow
       controlCube.moveLeft();
    }
    else if (e.keyCode == '39') {
       // right arrow
       controlCube.moveRight();
    }
}

// Cube game model
var gameCube = {
  'up': 2,
  'down':3,
  'left':1,
  'right':0,
  'front':4,
  'back':5,
  'turnLeft':function(d){
    var oU,oD,oL,oR,oF,oB;
    oU = this.up;
    oD = this.down;
    oL = this.left;
    oR = this.right;
    oF = this.front;
    oB = this.back;
    //changes
    this.up = oR;
    this.right = oD;
    this.down = oL;
    this.left = oU;
    if(puzzle.check(this.up, d.x,d.z) !== 1){
      return 0;
    }else{
      this.up = oU;
      this.down = oD;
      this.left = oL;
      this.right = oR;
      this.front = oF;
      this.back = oB;
      return 1;
    }
  },
  'turnRight':function(d){
    var oU,oD,oL,oR,oF,oB;
    oU = this.up;
    oD = this.down;
    oL = this.left;
    oR = this.right;
    oF = this.front;
    oB = this.back;
    //changes
    this.up = oL;
    this.right = oU;
    this.down = oR;
    this.left = oD;
    if(puzzle.check(this.up, d.x,d.z) !== 1){
      return 0;
    }else{
      this.up = oU;
      this.down = oD;
      this.left = oL;
      this.right = oR;
      this.front = oF;
      this.back = oB;
      return 1;
    }
  },
  'turnUp':function(d){
    var oU,oD,oL,oR,oF,oB;
    oU = this.up;
    oD = this.down;
    oL = this.left;
    oR = this.right;
    oF = this.front;
    oB = this.back;
    //changes
    this.up = oF;
    this.front = oD;
    this.down = oB;
    this.back = oU;
    if(puzzle.check(this.up, d.x,d.z) !== 1){
      return 0;
    }else{
      this.up = oU;
      this.down = oD;
      this.left = oL;
      this.right = oR;
      this.front = oF;
      this.back = oB;
      return 1;
    }
  },
  'turnDown':function(d){
    var oU,oD,oL,oR,oF,oB;
    oU = this.up;
    oD = this.down;
    oL = this.left;
    oR = this.right;
    oF = this.front;
    oB = this.back;
    //changes
    this.up = oB;
    this.front = oU;
    this.down = oF;
    this.back = oD;
    if(puzzle.check(this.up, d.x,d.z) !== 1){
      return 0;
    }else{
      this.up = oU;
      this.down = oD;
      this.left = oL;
      this.right = oR;
      this.front = oF;
      this.back = oB;
      return 1;
    }
  }
}

//puzzle checker
var puzzle = {
  'solve': 0,
  'position': [4,2],
  'scores': 0,
  'moves': 0,
  'create' : function(){
    this.position[0] = rad(this.position[0]);
    this.position[1] = rad(this.position[1]);
    this.solve = rbd(this.solve);
    this.score();
    var puzzleGeometry = new THREE.BoxGeometry( 1, 0.1, 1 );
    var puzzleMaterial = new THREE.MeshPhongMaterial({
      color: faceColorArray[this.solve],
      side: THREE.DoubleSide
    });
    scene.remove(puzzleMesh);
    puzzleMesh = new THREE.Mesh(puzzleGeometry, puzzleMaterial);
    puzzleMesh.position.set(this.position[0], -0.45, this.position[1]);
    scene.add(puzzleMesh);
  },
  'check' : function(c,x,z){
    //return -1 if not a puzzle block move, 0 if puzzle block solved, 1 if invalid
    if(this.position[0] == x && this.position[1] === z){
      if(this.solve === c){
        this.create();
        this.move();
        return 0;
      }else{
        return 1;
      }
    }else{
      this.move();
      return -1;
    }
  },
  'move': function(){
    this.moves++;
    $('.chances').html(this.moves);
    $('.box').css('border-color', cssColor[gameCube.up]);
    $('.container').css('color', cssColor[gameCube.up]);
  },
  'score': function(){
    this.scores++;
    $('.win').html(this.scores);
  }
}

//randomness helpers
var rad = function(shouldNot){
    var min,max,r;
    min = -7;
    max = 7;
    r = Math.floor(Math.random()*(max-min+1)+min);
    if(r === shouldNot){
      return rad(shouldNot);
    }else{
      return r;
    }
}
var rbd = function(shouldNot){
    var min,max,r;
    min = 0;
    max = 5;
    r = Math.floor(Math.random()*(max-min+1)+min);
    if(r === shouldNot){
      return rbd(shouldNot);
    }else{
      return r;
    }
}