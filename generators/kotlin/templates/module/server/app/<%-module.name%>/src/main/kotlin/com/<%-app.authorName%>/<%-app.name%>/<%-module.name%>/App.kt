package com.urosjarc.multibuild

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.http.content.resources
import io.ktor.http.content.static
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module(testing: Boolean = false) {
    routing {
        static("/") {
            resources("static")
        }
        get("/hello") {
            call.respondText("HELLO WORLD!", ContentType.Text.Plain)
        }
    }
}

