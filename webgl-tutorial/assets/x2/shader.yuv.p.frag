precision mediump float;

uniform sampler2D u_texY;
uniform sampler2D u_texU;
uniform sampler2D u_texV;
uniform vec4 u_diffuse;

varying vec2 v_uv;

// YUV to RGB coefficient matrix.
const mat3 coeff = mat3(
  1.0, 1.0, 1.0,
  0.0, -0.21482, 2.12798,
  1.28033, -0.38059, 0.0
);


void main () {
  vec3 yuv = vec3(texture2D(u_texY, v_uv).a, texture2D(u_texU, v_uv).a, texture2D(u_texV, v_uv).a) * 2.0 - 1.0;
  vec3 colour = (coeff * yuv + 1.0) / 2.0;

  gl_FragColor = u_diffuse * vec4(colour, 1.0);
}
