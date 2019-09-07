package com.<%-app.authorName%>.<%-app.name%>

import com.github.ajalt.clikt.core.CliktCommand

fun main(args: Array<String>) = App().main(args)

class App : CliktCommand() {
	val count: Int by option(help = "Number of greetings").int().default(1)
	val name: String by option(help = "The person to greet").prompt("Your name")

	override fun run() {
		for (i in 1..count) {
			echo("Hello $name!")
		}
	}
}

