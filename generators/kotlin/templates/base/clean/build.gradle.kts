import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    base
    id(Plug.kotlin_jvm.id) version Plug.kotlin_jvm.version apply false
	id(Plug.versions.id) version Plug.versions.version
}

//! Buildscript

allprojects {
    group = Proj.group
    version = Vers.project

    repositories {
        jcenter()
        google()
    }

    tasks.withType<Test> {
        useJUnitPlatform()
        testLogging {
            events("passed", "skipped", "failed")
        }
    }

    tasks.withType<KotlinCompile> {
        kotlinOptions {
            jvmTarget = Vers.jvm
            allWarningsAsErrors = true
        }
    }
}

subprojects {
	apply(plugin = Plug.kotlin_jvm.id)

	dependencies {
		val implementation by configurations
		val testImplementation by configurations

		implementation(Libs.kotlin_stdlib)
		testImplementation(Libs.junit_jupiter)
	}
}


