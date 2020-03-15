// vertex shader
precision mediump float;
precision mediump int;

uniform vec4 u_Color;
uniform mat4 u_Transform;
attribute vec3 a_Vertex;

void main() {
    gl_Position = u_Transform * vec4(a_Vertex, 1.0);
}
