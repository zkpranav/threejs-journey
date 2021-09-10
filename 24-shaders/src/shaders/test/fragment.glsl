// precision mediump float;

// uniform vec3 uColor;
// uniform sampler2D uTexture;

// varying vec2 vUV;
// varying float vElevation;

// void main() {
//     vec4 textureColor = texture2D(uTexture, vUV);
//     // textureColor.rgb *= vElevation * 2.0 + 0.5;
//     gl_FragColor = textureColor;
// }


precision mediump float;

varying float vRandom;

void main() {
    gl_FragColor = vec4(0.5, abs(vRandom), 1.0, 1.0);
}
