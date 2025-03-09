Embassy
===============                            

[Embassy](https://embassy.dev/)
===============================

*   [About](https://embassy.dev/)
    -----------------------------
    
*   [Documentation](https://embassy.dev/book/)
    ------------------------------------------
    
*   [API Reference](https://docs.embassy.dev/)
    ------------------------------------------
    
*   [Blog](https://embassy.dev/blog/)
    ---------------------------------
    
*   [Chat](https://matrix.to/#/#embassy-rs:matrix.org)
    --------------------------------------------------
    
*   [GitHub](https://github.com/embassy-rs/embassy)
    -----------------------------------------------
    

* * *

The next-generation framework for embedded applications
=======================================================

Write safe, correct and energy-efficient embedded code faster, using the Rust programming language, its async facilities, and the Embassy libraries.

[Get started](https://embassy.dev/book/#_getting_started)

Rust + async ❤️ embedded
------------------------

The [Rust programming language](https://www.rust-lang.org/) is blazingly fast and memory-efficient, with no runtime, garbage collector or OS. It catches a wide variety of bugs at compile time, thanks to its full memory- and thread-safety, and expressive type system.

Rust's [async/await](https://rust-lang.github.io/async-book/) allows for unprecedently easy and efficient multitasking in embedded systems. Tasks get transformed at compile time into state machines that get run cooperatively. It requires no dynamic memory allocation, and runs on a single stack, so no per-task stack size tuning is required. It obsoletes the need for a traditional RTOS with kernel context switching, and is [faster and smaller than one!](https://tweedegolf.nl/en/blog/65/async-rust-vs-rtos-showdown)

```rust
use defmt::info;
use embassy_executor::Spawner;
use embassy_nrf::gpio::{AnyPin, Input, Level, Output, OutputDrive, Pin, Pull};
use embassy_nrf::Peripherals;
use embassy_time::{Duration, Timer};

// Declare async tasks
#[embassy_executor::task]
async fn blink(pin: AnyPin) {
    let mut led = Output::new(pin, Level::Low, OutputDrive::Standard);

    loop {
        // Timekeeping is globally available, no need to mess with hardware timers.
        led.set_high();
        Timer::after_millis(150).await;
        led.set_low();
        Timer::after_millis(150).await;
    }
}

// Main is itself an async task as well.
#[embassy_executor::main]
async fn main(spawner: Spawner) {
    // Initialize the embassy-nrf HAL.
    let p = embassy_nrf::init(Default::default());

    // Spawned tasks run in the background, concurrently.
    spawner.spawn(blink(p.P0_13.degrade())).unwrap();

    let mut button = Input::new(p.P0_11, Pull::Up);
    loop {
        // Asynchronously wait for GPIO events, allowing other tasks
        // to run, or the core to sleep.
        button.wait_for_low().await;
        info!("Button pressed!");
        button.wait_for_high().await;
        info!("Button released!");
    }
}
```

Features
========

### Hardware Abstraction Layers

HALs implement safe, idiomatic Rust APIs to use the hardware capabilities, so raw register manipulation is not needed.

The Embassy project maintains HALs for select hardware, but you can still use HALs from other projects with Embassy.

*   [embassy-stm32](https://docs.embassy.dev/embassy-stm32/), for all STM32 microcontroller families.
*   [embassy-nrf](https://docs.embassy.dev/embassy-nrf/), for the Nordic Semiconductor nRF52, nRF53, nRF91 series.
*   [embassy-rp](https://docs.embassy.dev/embassy-rp/), for the Raspberry Pi RP2040 microcontroller.
*   [esp-rs](https://github.com/esp-rs), for the Espressif Systems ESP32 series of chips.

### Time that Just Works

No more messing with hardware timers. [embassy::time](https://docs.embassy.dev/embassy-time/) provides Instant, Duration and Timer types that are globally available and never overflow.

### Pick and choose

No need to buy into an entire ecosystem. You get to choose!

*   Async or blocking (the HAL supports both!).
*   Embassy executor or another runtime.
*   Provide your own time keeping.
*   Your own hal or the Embassy HAL.

### Real-time ready

Tasks on the same async executor run cooperatively, but you can create multiple executors with different priorities, so that higher priority tasks preempt lower priority ones. See the [example](https://github.com/embassy-rs/embassy/blob/master/examples/nrf52840/src/bin/multiprio.rs).

### Low-power ready

Easily build devices with years of battery life.

The async executor automatically puts the core to sleep when there's no work to do. Tasks are woken by interrupts, there is no busy-loop polling while waiting.

### Networking

The [embassy-net](https://docs.embassy.dev/embassy-net/) network stack implements extensive networking functionality, including Ethernet, IP, TCP, UDP, ICMP and DHCP. Async drastically simplifies managing timeouts and serving multiple connections concurrently.

### Bluetooth

The [nrf-softdevice](https://github.com/embassy-rs/nrf-softdevice) crate provides Bluetooth Low Energy 4.x and 5.x support for nRF52 microcontrollers.

### USB

[embassy-usb](https://docs.embassy.dev/embassy-usb/) implements a device-side USB stack. Implementations for common classes such as USB serial (CDC ACM) and USB HID are available, and a rich builder API allows building your own.

### Bootloader and DFU

[embassy-boot](https://github.com/embassy-rs/embassy/tree/master/embassy-boot) is a lightweight bootloader supporting firmware application upgrades in a power-fail-safe way, with trial boots and rollbacks.

* * *

[](https://embassy.dev/atom.xml)[](https://github.com/embassy-rs/)

Copyright © 2019-2024 Embassy project contributors

[Privacy](https://embassy.dev/privacy/)   [Sitemap](https://embassy.dev/sitemap.xml)

Links/Buttons:
- [Embassy](https://embassy.dev/)
- [Documentation](https://embassy.dev/book/)
- [API Reference](https://docs.embassy.dev/)
- [Blog](https://embassy.dev/blog/)
- [Chat](https://matrix.to/#/#embassy-rs:matrix.org)
- [GitHub](https://github.com/embassy-rs/embassy)
- [Get started](https://embassy.dev/book/#_getting_started)
- [Rust programming language](https://www.rust-lang.org/)
- [async/await](https://rust-lang.github.io/async-book/)
- [faster and smaller than one!](https://tweedegolf.nl/en/blog/65/async-rust-vs-rtos-showdown)
- [embassy-stm32](https://docs.embassy.dev/embassy-stm32/)
- [embassy-nrf](https://docs.embassy.dev/embassy-nrf/)
- [embassy-rp](https://docs.embassy.dev/embassy-rp/)
- [esp-rs](https://github.com/esp-rs)
- [embassy::time](https://docs.embassy.dev/embassy-time/)
- [example](https://github.com/embassy-rs/embassy/blob/master/examples/nrf52840/src/bin/multiprio.rs)
- [embassy-net](https://docs.embassy.dev/embassy-net/)
- [nrf-softdevice](https://github.com/embassy-rs/nrf-softdevice)
- [embassy-usb](https://docs.embassy.dev/embassy-usb/)
- [embassy-boot](https://github.com/embassy-rs/embassy/tree/master/embassy-boot)
- [](https://github.com/embassy-rs/)
- [Privacy](https://embassy.dev/privacy/)
- [Sitemap](https://embassy.dev/sitemap.xml)
