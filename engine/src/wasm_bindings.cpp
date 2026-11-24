#include "konoha/engine.hpp"

#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(konoha_engine) {
  emscripten::class_<konoha::Engine>("Engine")
      .constructor<>()
      .function("setInput", &konoha::Engine::setInput)
      .function("advance", &konoha::Engine::advance)
      .function("x", &konoha::Engine::x)
      .function("z", &konoha::Engine::z)
      .function("facing", &konoha::Engine::facing)
      .function("stamina", &konoha::Engine::stamina)
      .function("speed", &konoha::Engine::speed);
}
