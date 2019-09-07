import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    application
}

application {
    mainClassName = "${project.group}.AppKt"
}

dependencies {
    implementation(Libs.clickt)
}
