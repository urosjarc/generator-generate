object Proj {
    val name = "<%-app.name%>"
    val group = "com.<%-app.authorName%>.$name"
}

object Mods {
	val core = ":core"

	//! Modules
}

object Bintray {
	//! Bintray
}

object Plug {
	val kotlin_jvm = Plugin("org.jetbrains.kotlin.jvm", Vers.kotlin)
	val versions = Plugin("com.github.ben-manes.versions", Vers.versions)
	//! Plugins
}

object Vers {
    val project = "<%-app.version%>"
    val jvm = "<%-base.jvm_version%>"
    val kotlin = "<%-base.kotlin_version%>"
	val kotlin_coroutines = "<%-base.kotlin_coroutines%>"
	val junit = "<%-base.junit_version%>"
	val versions = "<%-base.versions_version%>"
	//! Versions
}

object Libs {
    val kotlin_stdlib = "org.jetbrains.kotlin:kotlin-stdlib-jdk8:${Vers.kotlin}"
	val junit_jupiter = "org.junit.jupiter:junit-jupiter:${Vers.junit}"
	val kotlin_coroutines = "org.jetbrains.kotlinx:kotlinx-coroutines-core:${Vers.kotlin_coroutines}"
	//! Libs
}
