cmake_minimum_required(VERSION 3.16)
project(KonohaEngine LANGUAGES CXX)

add_library(konoha_engine STATIC src/engine.cpp)
target_include_directories(konoha_engine PUBLIC include)
target_compile_features(konoha_engine PUBLIC cxx_std_17)
set_target_properties(konoha_engine PROPERTIES POSITION_INDEPENDENT_CODE ON)

if(EMSCRIPTEN)
  add_executable(game src/wasm_bindings.cpp)
  target_link_libraries(game PRIVATE konoha_engine)
  target_compile_features(game PRIVATE cxx_std_17)
  set_target_properties(game PROPERTIES
    OUTPUT_NAME "game"
    SUFFIX ".js"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../public/wasm")
  target_link_options(game PRIVATE
    "--bind"
    "-sMODULARIZE=1"
    "-sEXPORT_ES6=1"
    "-sENVIRONMENT=web"
    "-sALLOW_MEMORY_GROWTH=1"
    "-sWASM=1")
endif()
