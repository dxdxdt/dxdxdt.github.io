precision mediump float;

struct TextureSet {
  sampler2D lighted;
  sampler2D ambient;
  sampler2D bloom;
};

uniform TextureSet u_tex;

varying vec2 v_uv;


void main () {
  vec3 c =
    texture2D(u_tex.lighted, v_uv).rgb +
    texture2D(u_tex.ambient, v_uv).rgb +
    texture2D(u_tex.bloom, v_uv).rgb;

  gl_FragColor = vec4(c, 1.0);
}
