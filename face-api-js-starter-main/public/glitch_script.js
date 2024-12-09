document.addEventListener('DOMContentLoaded', () => {
    let scene, camera, renderer, controls, particles, curves;

    function init() {
        scene = new THREE.Scene();
        

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 50, 150);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        //Set orbital 
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        //this is where we create the sunlight
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(50, 100, 50);
        scene.add(light);

        createParticles();

        createCurves();

        //Handle window resizing
        window.addEventListener('resize', onWindowResize);

        //Start the animation
        animate();
    }

    //paticles
    function createParticles() {
        const particleCount = 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            //random particles
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;

            positions.push(x, y, z);

            //Assign random colors with transparency for an organic feel
            colors.push(Math.random(), Math.random(), Math.random());
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function createCurves() {
        const curveMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            transparent: true,
            opacity: 0.5
        });

        curves = new THREE.Group();

        for (let i = 0; i < 50; i++) {
            const controlPoints = [];
            for (let j = 0; j < 4; j++) {
                const x = (Math.random() - 0.5) * 200;
                const y = (Math.random() - 0.5) * 200;
                const z = (Math.random() - 0.5) * 200;
                controlPoints.push(new THREE.Vector3(x, y, z));
            }

            const curve = new THREE.CubicBezierCurve3(
                controlPoints[0],
                controlPoints[1],
                controlPoints[2],
                controlPoints[3]
            );

            const points = curve.getPoints(50);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            const curveLine = new THREE.Line(geometry, curveMaterial);
            curves.add(curveLine);
        }

        scene.add(curves);
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        curves.rotation.y -= 0.001;
        curves.rotation.x += 0.0003;

        controls.update();
        renderer.render(scene, camera);
    }

    init();
});
