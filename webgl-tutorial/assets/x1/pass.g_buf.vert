uniform mat4 u_model;
uniform mat3 u_nm;
uniform mat4 u_tf;

attribute vec3 a_pos_ms;
attribute vec3 a_normal_ms;
attribute vec2 a_uv;

varying vec3 v_pos_ws;
varying vec3 v_normal_ws;
varying vec2 v_uv;


void main () {
  gl_Position = u_tf * vec4(a_pos_ms, 1.0);
  v_pos_ws = (u_model * vec4(a_pos_ms, 1.0)).xyz;
  v_normal_ws = (u_nm * a_normal_ms).xyz;
  v_uv = a_uv;
}
