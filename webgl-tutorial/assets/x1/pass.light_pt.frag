#extension GL_EXT_draw_buffers : require
precision mediump float;

struct TextureSet {
  sampler2D pos;
  sampler2D normal;
  sampler2D uv;
  sampler2D spec;
};
struct LightProperty {
  vec3 pos_ws;
  vec3 color;
  float shininess;
  float lc;
  float ll;
  float lq;
};

uniform TextureSet u_tex;
uniform LightProperty u_light;
uniform vec3 u_viewPos;

varying vec2 v_uv;


void main () {
  vec3 pos_ws = texture2D(u_tex.pos, v_uv).rgb;
  vec3 normal_us = normalize(texture2D(u_tex.normal, v_uv).rgb);
  vec3 uvColor = texture2D(u_tex.uv, v_uv).rgb;
  vec3 specColor = texture2D(u_tex.spec, v_uv).rgb;
  float att, d, tDiff, tSpec;
  vec3 lightDir, viewDir, reflectDir, cDiff, cSpec;

  d = length(pos_ws - u_light.pos_ws);
  att = 1.0 / (u_light.lc + u_light.ll * d + u_light.lq * d * d);

  lightDir = normalize(u_light.pos_ws - pos_ws);
  tDiff = max(dot(normal_us, lightDir), 0.0);
  cDiff = tDiff * att * u_light.color * uvColor;

  viewDir = normalize(u_viewPos - pos_ws);
  reflectDir = reflect(-lightDir, normal_us);
  tSpec = pow(max(dot(viewDir, reflectDir), 0.0), u_light.shininess);
  cSpec = tSpec * att * specColor * u_light.color;

  gl_FragData[0] = vec4(cDiff, 1.0);
  gl_FragData[1] = vec4(cSpec, 1.0);
}
