precision mediump float;

uniform sampler2D u_texDiffuse;
uniform sampler2D u_texNormal;
uniform sampler2D u_texSpecular;
uniform highp mat3 u_mv;
uniform highp mat4 u_v;
uniform highp mat4 u_m;
uniform highp vec3 u_wsLightPos;
uniform highp vec3 u_lightColour;
uniform highp vec3 u_ambientColour;
uniform highp float u_lightPower;

varying vec2 v_uv;
varying vec3 v_wsPos;
varying vec3 v_csEyeDir;
varying vec3 v_csLightDir;
varying vec3 v_tsLightDir;
varying vec3 v_tsEyeDir;


void main () {
  vec3 diffuseColour = texture2D(u_texDiffuse, v_uv).rgb;
  vec3 ambientColour = u_ambientColour * diffuseColour;
  vec3 specularColour = texture2D(u_texSpecular, v_uv).rgb * 0.3;
  vec3 tsTextureNormal = normalize(texture2D(u_texNormal, vec2(v_uv.x, -v_uv.y)).rgb * 2.0 - 1.0);
  float d = length(u_wsLightPos - v_wsPos);
  float dSq = d * d;
  vec3 n = tsTextureNormal;
  vec3 l = normalize(v_tsLightDir);
  float cosTheta = clamp(dot(n, l), 0.0, 1.0);
  vec3 E = normalize(v_tsEyeDir);
  vec3 R = reflect(-l, n);
  float cosAlpha = clamp(dot(E, R), 0.0, 1.0);

  gl_FragColor = vec4(
    ambientColour +
    diffuseColour * u_lightColour * u_lightPower * cosTheta / dSq +
    specularColour * u_lightColour * u_lightPower * pow(cosAlpha, 5.0) / dSq
    , 1.0);
}
