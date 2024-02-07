import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import { loadImageShape } from "@tsparticles/shape-image";
import { IOptions } from "@tsparticles/engine";
import Snowflake from "../../assets/welcome-assets/snowflake.svg"

const Snow : React.FC = () => {
	const [init, setInit] = useState(false);

	useEffect(() => {
		initParticlesEngine(async (engine) => {
		  await loadSnowPreset(engine);
		  await loadImageShape(engine);
		}).then(() => {
		  setInit(true);
		});
	  }, []);


	if (init) {
		return (<Particles id="tsparticles" options={{
			preset: "snow",
			background: {
				opacity: 0
			},
			particles: {
				shape: {
					type: "image",
					options: {
						"image": {
							"src": Snowflake,
						}
					}
				},
			}
		}}/>);
	}

	return (null);
}

export default Snow;