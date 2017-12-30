#extension GL_EXT_draw_buffers : require
precision mediump float;

struct TextureSet {
  sampler2D surface;
  sampler2D specular;
};

uniform TextureSet u_ts;
uniform float u_ambientFactor;

varying vec3 v_pos_ws;
varying vec3 v_normal_ws;
varying vec2 v_uv;


void main () {
  vec3 m = texture2D(u_ts.surface, v_uv).rgb;
  vec3 s = texture2D(u_ts.specular, v_uv).rgb;

  gl_FragData[0] = vec4(v_pos_ws, 1.0);
  gl_FragData[1] = vec4(v_normal_ws, 1.0);
  gl_FragData[2] = vec4(m, 1.0);
  gl_FragData[3] = vec4(s, 1.0);
  gl_FragData[4] = vec4(m * u_ambientFactor, 1.0);
}
