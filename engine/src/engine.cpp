#include "konoha/engine.hpp"

#include <algorithm>
#include <cmath>

namespace konoha {

void Engine::setInput(double x, double z, bool sprint) {
  const double magnitude = std::sqrt(x * x + z * z);
  if (magnitude > 1.0) {
    x /= magnitude;
    z /= magnitude;
  }
  inputX_ = x;
  inputZ_ = z;
  sprint_ = sprint && magnitude > 0.0 && stamina_ > 0.0;
}

void Engine::advance(double elapsedSeconds) {
  accumulator_ += std::clamp(elapsedSeconds, 0.0, 0.25);
  while (accumulator_ >= kFixedStep) {
    tick();
    accumulator_ -= kFixedStep;
  }
}

void Engine::tick() {
  const double magnitude = std::sqrt(inputX_ * inputX_ + inputZ_ * inputZ_);
  if (magnitude < 0.001) {
    speed_ = 0.0;
    stamina_ = std::min(100.0, stamina_ + 16.0 * kFixedStep);
    return;
  }

  const bool canSprint = sprint_ && stamina_ > 0.0;
  const double maxSpeed = canSprint ? 8.0 : 4.5;
  speed_ = maxSpeed;
  if (canSprint) stamina_ = std::max(0.0, stamina_ - 24.0 * kFixedStep);
  else stamina_ = std::min(100.0, stamina_ + 5.0 * kFixedStep);

  x_ += inputX_ * speed_ * kFixedStep;
  z_ += inputZ_ * speed_ * kFixedStep;
  facing_ = std::atan2(inputX_, inputZ_);
}

}  // namespace konoha
