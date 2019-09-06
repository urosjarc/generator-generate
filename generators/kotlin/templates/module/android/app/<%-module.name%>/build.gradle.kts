plugins {
    for(plug in Plug.android)
        id(plug.id)
    id(Plug.kotlin_kapt.id)
}

android {
    compileSdkVersion(Android.compileSdkVersion)
    buildToolsVersion = Android.buildToolVersion

    defaultConfig {
        applicationId = "${Proj.group}.${project.name}"
        minSdkVersion(Android.minSdkVersion)
        targetSdkVersion(Android.targetSdkVersion)
        versionCode = Android.versionCode
        versionName = Android.versionName

        testInstrumentationRunner = Android.testInstrumentationRunner
    }

    buildTypes {
       getByName("release") {
           isMinifyEnabled = false
           proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
       }
    }

}

dependencies {
    implementation(project(Mods.adapters))
    implementation(Libs.kotlin_stdlib)

    for(lib in Libs.android)
        implementation(lib)

    for(lib in Libs.android_test)
        androidTestImplementation(lib)

    testImplementation(Libs.junit_old)
    testRuntimeOnly(Libs.junit_vintage)
}
