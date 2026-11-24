#pragma once

namespace konoha {

class Engine {
 public:
  static constexpr double kFixedStep = 1.0 / 60.0;

  void setInput(double x, double z, bool sprint);
  void advance(double elapsedSeconds);
  double x() const { return x_; }
  double z() const { return z_; }
  double facing() const { return facing_; }
  double stamina() const { return stamina_; }
  double speed() const { return speed_; }

 private:
  void tick();
  double inputX_ = 0.0;
  double inputZ_ = 0.0;
  double accumulator_ = 0.0;
  double x_ = 0.0;
  double z_ = 0.0;
  double facing_ = 0.0;
  double stamina_ = 100.0;
  double speed_ = 0.0;
  bool sprint_ = false;
};

}  // namespace konoha
