precision mediump float;

struct TextureSet {
  sampler2D bloom;
};
struct TexelStep {
  float w;
  float h;
};

uniform TextureSet u_tex;
uniform TexelStep u_propBlurStep;
uniform float u_propWeight[9];

varying vec2 v_uv;


void main () {
  vec3 ret;
  vec2 s;

  ret = texture2D(u_tex.bloom, v_uv).rgb * u_propWeight[0];
  for (int i = 1; i < 9; i += 1) {
    s = vec2(u_propBlurStep.w * float(i), u_propBlurStep.h * float(i));
    ret +=
      (texture2D(u_tex.bloom, v_uv + s).rgb +
      texture2D(u_tex.bloom, v_uv - s).rgb) *
      u_propWeight[i];
  }

  gl_FragColor = vec4(ret, 1.0);
}
