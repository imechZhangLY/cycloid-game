// vertex shader
precision mediump float;
precision mediump int;

uniform vec4 u_Color_1;
uniform mat4 u_Transform_1;
attribute vec3 a_Vertex_1;

void main() {
    gl_Position = u_Transform_1 * vec4(a_Vertex_1, 1.0);
}
