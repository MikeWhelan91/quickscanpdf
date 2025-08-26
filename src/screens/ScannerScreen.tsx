import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { colors } from "../theme/colors";
import { usePages } from "../store/PagesContext";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import { nanoid } from "../utils/uid";
import { autoCropToA4 } from "../utils/autoCrop";

export default function ScannerScreen({ navigation }: any) {
  // Expo Camera permissions hook
  const [permission, requestPermission] = useCameraPermissions();

  // Ref to the camera. Use `any` for cross-SDK compatibility.
  const camRef = useRef<any>(null);

  const { addPage } = usePages();

  useEffect(() => {
    if (!permission || !permission.granted) requestPermission();
  }, [permission]);

  const afterCapturePrompt = () => {
    Alert.alert(
      "Add another page?",
      "Do you want to continue scanning?",
      [
        { text: "Finish", onPress: () => navigation.navigate("Review") },
        { text: "Scan more", onPress: () => {} },
      ],
      { cancelable: false }
    );
  };

  const takePicture = async () => {
    try {
      if (!camRef.current) return;
      const photo = await camRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });
      const cropped = await autoCropToA4(photo.uri);
      addPage({ id: nanoid(), uri: cropped, rotation: 0 });
      afterCapturePrompt();
    } catch (e) {
      Alert.alert("Error", "Could not capture image.");
    }
  };

  // Ask for camera permission first
  if (!permission || !permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>
          Grant camera permission to scan.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Capture — New Scan" />
      <View style={styles.cameraWrap}>
        {/* SDK 53+: CameraView with facing='back' */}
        <CameraView ref={camRef} style={styles.camera} facing="back" />
      </View>
      <View style={styles.controls}>
        <Button title="Capture" onPress={takePicture} />
        <Button
          title="Finish"
          variant="ghost"
          onPress={() => navigation.navigate("Review")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  cameraWrap: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  camera: { flex: 1 },
  controls: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
