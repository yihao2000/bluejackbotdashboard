"use client"
import Particles from "react-tsparticles";
import particlesConfig from "../background/config/particles-config";

import { loadFull } from "tsparticles";


export default function ParticlesBackground() {
	

	const particlesInit = async (main) => {
		console.log(main);
		await loadFull(main);
	};
	const particlesLoaded = (container) => {
		console.log(container);
	};
	return (
		<Particles
			params={particlesConfig} 
			id="tsparticles"
			init={particlesInit}
			loaded={particlesLoaded}
		/>
	);
}