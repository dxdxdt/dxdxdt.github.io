uniform mat4 u_tf;

attribute vec3 a_pos_ms;
attribute vec2 a_uv;

varying vec2 v_uv;


void main () {
  gl_Position = u_tf * vec4(a_pos_ms, 1.0);
  v_uv = a_uv;
}
