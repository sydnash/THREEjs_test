/**
 * Created by test on 2017/5/10.
 */
(function(){
    function View(domElement) {
        if (domElement === undefined) {
            throw new Error("view's domelement must not be undefined.");
        }
        this.domElement = domElement
        this.renderner = new THREE.WebGLRenderer({alpha:1, antialias: true, clearColor: 0x0});
        this.renderner.setSize(window.innerWidth, window.innerHeight)
        this.renderner.shadowMap = true;
        this.domElement.appendChild(this.renderner.domElement);

        this.scene = new THREE.Scene();
        this.model = new THREE.Object3D();

        this.camera = new THREE.PerspectiveCamera(45, this.domElement.clientWidth / this.domElement.clientHeight, 1, 100000);
        this.camera.position.set(5000, 5000, 5000);

        this.controls = new THREE.FirstPersonControls(this.camera, this.renderner.domElement);

        this.cameraLight = new THREE.PointLight(0xffffff, 1, 0);
        this.scene.add(this.camera);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.model);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
        this.scene.add(this.ambientLight)
        this.updateLight()
    }
    function v( x, y, z ){ return new THREE.Vector3( x, y, z ); }
    var pi = Math.PI, pi05 = pi * 0.5, pi2 = pi + pi;
    var d2r = pi / 180, r2d = 180 / pi;  // degrees / radians
    function convertPosition( lat, lon, radius ) {
        var rc = radius * Math.cos( lat * d2r );
        return v( rc * Math.cos( lon * d2r ), radius * Math.sin( lat * d2r ), rc * Math.sin( lon * d2r) );
    }

    View.prototype = {
        constructor : View,

        clearModel : function() {
            while(this.model.length > 0){
                scene.remove(scene.children[0]);
            }
        },

        addModel : function(filename) {
            var loader = new THREE.ObjectLoader();
            self = this
            loader.load(filename, function (result) {
                self.model.add(result)

                    var geometry = new THREE.BoxGeometry(500, 500, 500)
                    var material = new THREE.MeshBasicMaterial({color : 0x00ff00 });
                    cube = new THREE.Mesh(geometry, material);
                    cube.position.set(0, 0, 0)

                self.model.add(cube)
            },
            function (xhr) {
                console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            function(xhr) {
                console.error( 'An error happened' );
            });
        },

        animate : function () {
            self = this
            requestAnimationFrame(function() {
                self.animate();
            })
            this.renderner.render(this.scene, this.camera);
            this.controls.update(1);
            this.cameraLight.position.copy(this.camera.position)
        },
        updateLight : function () {
            if (this.light) {
                this.scene.remove(light);
            }
            light = new THREE.DirectionalLight( 0xffffff, 0.5 );
            this.light = light
            var pos = convertPosition(  43, -75, 10000 );
            light.position = pos;
            light.castShadow = true;
            light.shadowMapWidth = 2048;
            light.shadowMapHeight = 2048;
            var d = 10000;
            light.shadowCameraLeft = -d;
            light.shadowCameraRight = d;
            light.shadowCameraTop = d * 2;
            light.shadowCameraBottom = -d * 2;

            light.shadowCameraNear = 1000;
            light.shadowCameraFar = 20000;
            this.scene.add( this.light );
        },
}

    window.View = View
}())
