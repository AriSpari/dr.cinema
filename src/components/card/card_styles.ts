import { StyleSheet } from "react-native";

export default StyleSheet.create({
  cardWrapper: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  colorBar: {
    height: 6,
    width: "100%",
  },

  card: {
    padding: 16,
    backgroundColor: "#ffff",
    borderWidth: 2,
    borderColor: "transparent",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  cardWithColor: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  cardSelected: {
    borderColor: "#ff4444",
    backgroundColor: "#ffecec",
    transform: [{ scale: 1.02 }],
  },

  cardFinished: {
    backgroundColor: "#e8f5e9",
    opacity: 0.8,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTextContainer: {
    flex: 1,
    marginRight: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  cardTitleFinished: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  cardSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },

  cardDescription: {
    fontSize: 12,
    fontWeight: "400"
  },

  cardSubtitleFinished: {
    textDecorationLine: "line-through",
  },

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },

  checkButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },

  checkButtonDone: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },

  moveActionButton: {
    backgroundColor: "#e3f2fd",
  },

  deleteActionButton: {
    backgroundColor: "#ffcdd2",
  },

  actionIcon: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Image card styles
  imageCard: {
    height: 160,
    justifyContent: "flex-end",
    borderRadius: 16,
    overflow: "hidden",
  },

  imageCardBackground: {
    borderRadius: 16,
  },

  imageColorBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },

  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  imageCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageCardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  imageCardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
  },

  imageCardDescription: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

  imageActionButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 2,
  },

  // Color picker modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  colorPickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: 280,
    alignItems: "center",
  },

  colorPickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "transparent",
  },

  colorOptionSelected: {
    borderColor: "#333",
    transform: [{ scale: 1.1 }],
  },

  // Delete confirmation modal styles
  confirmContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 280,
    alignItems: "center",
  },

  confirmTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },

  confirmMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },

  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },

  confirmCancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },

  confirmCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  confirmDeleteButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f44336",
    alignItems: "center",
  },

  confirmDeleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  editActionButton: {
    backgroundColor: "#2196F3", // blue
  },
  imagePickerButton: {
    backgroundColor: "#a2ff00ff", // yellow
    borderColor: "#304c00fc",
  },
});
