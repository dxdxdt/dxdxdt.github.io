#extension GL_EXT_draw_buffers : require
precision mediump float;

uniform sampler2D u_tex;
uniform vec3 u_baseColor;

varying vec2 v_uv;


void main () {
  gl_FragData[0] = gl_FragData[1] =
    vec4(texture2D(u_tex, v_uv).rgb * u_baseColor, 1.0);
}
