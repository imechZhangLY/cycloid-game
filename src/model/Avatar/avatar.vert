// vertex shader
precision mediump float;
precision mediump int;

uniform vec4 u_Color;
uniform mat4 u_Transform;
attribute vec3 a_Vertex;
attribute vec2 a_Texture;
varying vec2 v_Texture;
varying vec2 v_ImageTexture;

void main() {
    gl_Position = u_Transform * vec4(a_Vertex, 1.0);
    v_Texture = a_Texture;
    v_ImageTexture = vec2(a_Vertex.x + 0.5, -a_Vertex.y + 0.5);
}
