precision highp float;

attribute vec3 a_msPos;
attribute vec2 a_uv;
attribute vec3 a_msNormal;
attribute vec3 a_msTangent;
attribute vec3 a_msBitangent;

varying vec2 v_uv;
varying vec3 v_wsPos;
varying vec3 v_csEyeDir;
varying vec3 v_csLightDir;
varying vec3 v_tsLightDir;
varying vec3 v_tsEyeDir;

uniform mat4 u_mvp;
uniform mat3 u_mv;
uniform mat4 u_v;
uniform mat4 u_m;
uniform vec3 u_wsLightPos;


void main () {
  vec4 msPos = vec4(a_msPos, 1.0);
  vec4 lightPos = vec4(u_wsLightPos, 1.0);
  vec3 csPos = (u_v * u_m * msPos).xyz;
  vec3 csLightPos = (u_v * lightPos).xyz;
  vec3 csTangent = u_mv * a_msTangent;
  vec3 csBitangent = u_mv * a_msBitangent;
  vec3 csNormal = u_mv * a_msNormal;
  mat3 TBN = mat3(
    csTangent.x, csBitangent.x, csNormal.x,
    csTangent.y, csBitangent.y, csNormal.y,
    csTangent.z, csBitangent.z, csNormal.z);

  gl_Position = u_mvp * msPos;
  v_wsPos = (u_m * msPos).xyz;
  v_csEyeDir = vec3(0.0, 0.0, 0.0) - csPos;
  v_csLightDir = csLightPos + v_csEyeDir;
  v_uv = a_uv;
  v_tsLightDir = TBN * v_csLightDir;
  v_tsEyeDir = TBN * v_csEyeDir;
}
