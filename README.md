# Konoha: Sombras da Floresta

Protótipo de fã, sem fins comerciais. Esta primeira fase entrega uma cena 3D pequena e jogável: mova o ninja pela clareira usando WASD ou as setas. Os modelos são placeholders procedurais.

## Requisitos

- Node.js 20+
- CMake 3.16+
- Emscripten 3.1+ (para compilar o núcleo C++ para WebAssembly)

## Rodar no navegador

```sh
npm run dev
```

Abra `http://localhost:4173`. Sem o módulo WASM compilado, o cliente usa uma simulação JavaScript simples e mostra um aviso. Para rodar com o núcleo C++:

```sh
mkdir -p public/wasm
emcmake cmake -S engine -B build/wasm -DCMAKE_BUILD_TYPE=Release
cmake --build build/wasm
npm run dev
```

O build gera `public/wasm/game.js` e `public/wasm/game.wasm`. O Three.js está incluído em `public/vendor/` com sua licença MIT; não é preciso baixar dependências npm. Sirva o jogo por HTTP; abrir o HTML diretamente como `file://` impede o carregamento correto de módulos.

## Publicação no GitHub Pages

O site público é preparado em `docs/` com:

```sh
npm run build:pages
```

O Pages publica a pasta `docs/` da branch `main`.

## Controles

- **WASD / setas:** mover
- **Shift:** correr
- A câmera acompanha o personagem. Nesta fase, o espaço de teste é uma clareira cercada por árvores.

## Estrutura

```text
engine/       simulação C++17 e alvo Emscripten/embind
client/       renderização Three.js, câmera e controles
ui/           HTML e CSS
data/         JSON de configuração inicial
assets/       reservado para modelos e áudio originais
public/wasm/  artefatos gerados pelo Emscripten
```

## Fases

1. **Fundação 3D:** núcleo C++/WASM, cena Three.js e movimento básico (esta entrega).
2. **Mundo:** vila, floresta, chunks, ciclo de luz e minimapa.
3. **Combate e jutsus:** simulação e conteúdo dirigido por JSON.
4. **IA:** inimigos comuns e elites.
5. **Missões e vida na vila:** NPCs, diálogos, lojas e inventário.
6. **Chefes:** arenas e confrontos em fases.
7. **Progressão:** árvore de habilidades e três slots de save.
8. **Polimento:** áudio, acessibilidade, otimização e testes.

O escopo completo é grande para um protótipo. Cada fase será entregue e revisada em separado antes de avançar.
