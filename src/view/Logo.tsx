import { Avatar, AvatarSizes } from 'flowbite-react';

const blockies: any = require('blockies-identicon');

export interface LogoProps {
    addr: string
    size?: keyof AvatarSizes;
}

function Logo(props: LogoProps) {
    const icon: HTMLCanvasElement = blockies.create({ // All options are optional
        seed: props.addr, // seed used to generate icon data, default: random
        color: 'rgb(16 185 129)', // to manually specify the icon color, default: random
        bgcolor: 'rgb(253 230 138)', // choose a different background color, default: random
        size: 10, // width/height of the icon in blocks, default: 8
        scale: 3, // width/height of each block in pixels, default: 4
        spotcolor: 'rgb(254 205 211)', // each pixel has a 13% chance of being of a third color, 
        default: -1 //random. Set to -1 to disable it. These "spots" create structures
        // that look like eyes, mouths and noses. 
    });
    return (
        <Avatar rounded={true} size={props.size || 'sm'} img={icon.toDataURL()} stacked={true} style={{ minWidth: "fit-content" }} >
        </Avatar>
    );
}

export default Logo;
