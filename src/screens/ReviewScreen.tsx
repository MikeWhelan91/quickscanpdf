import React from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { colors } from "../theme/colors";
import { usePages } from "../store/PagesContext";
import { PageItem } from "../components/PageItem";
import { Button } from "../components/Button";
import { TopBar } from "../components/TopBar";
import * as Sharing from "expo-sharing";
import { imagesToPdf } from "../utils/pdf";
import * as ImageManipulator from 'expo-image-manipulator';
import { useScansStore } from "../store/ScansStore";
export default function ReviewScreen({ navigation }: any) {
  const { pages, rotateRight, moveUp, moveDown, removePage, clear } =
    usePages();
  const { addScan } = useScansStore();
const handleExport = async () => {
  if (pages.length === 0) { /* ... */ return; }

  try {
    // Respect per-page rotation before generating the PDF
    const processedUris = await Promise.all(
      pages.map(async (p) => {
        if (!p.rotation) return p.uri;
        const out = await ImageManipulator.manipulateAsync(
          p.uri,
          [{ rotate: p.rotation }],
          { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
        );
        return out.uri;
      })
    );

    const pdf = await imagesToPdf(processedUris);
      await addScan({
        id: String(Date.now()),
        createdAt: Date.now(),
        pages: pages.length,
        pdfUri: pdf,
        name: "Scan " + new Date().toLocaleString(),
      });
      clear();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdf);
      } else {
        Alert.alert("Saved", `PDF saved to: ${pdf}`);
      }
      navigation.navigate("Home");
    } catch {
      Alert.alert("Error", "Failed to export PDF.");
    }
  };
  return (
    <View style={styles.container}>
      <TopBar title="Review — Crop & Enhance" />
      <View style={{ flex: 1, padding: 16 }}>
        {pages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No pages yet. Capture from the camera.
            </Text>
          </View>
        ) : (
          <FlatList
            data={pages}
            keyExtractor={(p) => p.id}
            renderItem={({ item, index }) => (
              <PageItem
                uri={item.uri}
                index={index}
                onRotate={() => rotateRight(item.id)}
                onUp={() => moveUp(item.id)}
                onDown={() => moveDown(item.id)}
                onRemove={() => removePage(item.id)}
              />
            )}
          />
        )}
      </View>
      <View style={styles.footer}>
        <Button
          title="Back to Camera"
          variant="ghost"
          onPress={() => navigation.navigate("Scan")}
        />
       <Button
  title={`Export PDF (${pages.length} page${pages.length !== 1 ? 's' : ''})`}
  onPress={handleExport}
/>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.subtext },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
