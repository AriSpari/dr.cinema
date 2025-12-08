import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  GestureResponderEvent,
  Modal,
  ImageBackground,
} from "react-native";
import styles from "./card_styles";
import { COLOR_OPTIONS } from "@/src/styles/colors";


type CardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  selected?: boolean;
  color?: string;
  isFinished?: boolean;
  imageUrl?: string;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onColorChange?: (color: string) => void;
  onToggleFinished?: () => void;
  onMove?: () => void;
  onImageChange?: () => void;
};

export function Card({
  title,
  description,
  subtitle,
  selected,
  color,
  isFinished,
  imageUrl,
  onPress,
  onLongPress,
  onDelete,
  onEdit,
  onColorChange,
  onToggleFinished,
  onMove,
  onImageChange,
}: CardProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasActions = onColorChange || onDelete || onToggleFinished || onMove || onEdit || onImageChange;

  const handleDeletePress = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  // Delete confirmation modal
  const DeleteConfirmModal = (
    <Modal
      visible={showDeleteConfirm}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDeleteConfirm(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmTitle}>Delete {title}?</Text>
          <Text style={styles.confirmMessage}>This action cannot be undone.</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={() => setShowDeleteConfirm(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmDeleteButton}
              onPress={handleConfirmDelete}
            >
              <Text style={styles.confirmDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Card with image background
  if (imageUrl) {
    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.9}
          style={[selected && styles.cardSelected]}
        >
          <ImageBackground
            source={{ uri: imageUrl }}
            style={styles.imageCard}
            imageStyle={styles.imageCardBackground}
          >
            {/* Color bar overlay at top */}
            {color && <View style={[styles.imageColorBar, { backgroundColor: color }]} />}

            {/* Dark overlay for text readability */}
            <View style={styles.imageOverlay}>
              <View style={styles.imageCardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.imageCardTitle}>{title}</Text>
                  {subtitle ? (
                    <Text style={styles.imageCardSubtitle}>{subtitle}</Text>
                  ) : null}
                  {description ? (
                    <Text style={styles.imageCardDescription}>{description}</Text>
                  ) : null}
                </View>

                {/* Action buttons */}
                {hasActions && (
                  <View style={styles.cardActions}>
                    {onImageChange && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.imageActionButton, styles.imagePickerButton]}
                        onPress={onImageChange}
                      >
                        <Text style={styles.actionIcon}>📷</Text>
                      </TouchableOpacity>
                    )}
                    {onColorChange && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.imageActionButton, { borderColor: color || "#fff" }]}
                        onPress={() => setShowColorPicker(true)}
                      >
                        <Text style={styles.actionIcon}>🎨</Text>
                      </TouchableOpacity>
                    )}
                    {onDelete && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.imageActionButton, styles.deleteActionButton]}
                        onPress={handleDeletePress}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Color Picker Modal */}
        <Modal
          visible={showColorPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowColorPicker(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowColorPicker(false)}
          >
            <View style={styles.colorPickerContainer}>
              <Text style={styles.colorPickerTitle}>Choose Color</Text>
              <View style={styles.colorGrid}>
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorOption,
                      { backgroundColor: c },
                      color === c && styles.colorOptionSelected,
                    ]}
                    onPress={() => {
                      onColorChange?.(c);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {DeleteConfirmModal}
      </View>
    );
  }

  // Regular card without image
  return (
    <View style={styles.cardWrapper}>
      {/* Color indicator line at top */}
      {color && <View style={[styles.colorBar, { backgroundColor: color }]} />}

      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={[
          styles.card,
          color && styles.cardWithColor,
          selected && styles.cardSelected,
          isFinished && styles.cardFinished,
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardTextContainer}>
            <Text style={[styles.cardTitle, isFinished && styles.cardTitleFinished]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.cardSubtitle, isFinished && styles.cardSubtitleFinished]}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Action buttons */}
          {hasActions && (
            <View style={styles.cardActions}>
              {onImageChange && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.imagePickerButton]}
                  onPress={onImageChange}
                >
                  <Text style={styles.actionIcon}>📷</Text>
                </TouchableOpacity>
              )}
              {onToggleFinished && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.checkButton,
                    isFinished && styles.checkButtonDone,
                  ]}
                  onPress={onToggleFinished}
                >
                  <Text style={styles.actionIcon}>{isFinished ? "✓" : ""}</Text>
                </TouchableOpacity>
              )}
              {onEdit && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.editActionButton]}
                  onPress={onEdit}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
              )}
              {onMove && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.moveActionButton]}
                  onPress={onMove}
                >
                  <Text style={styles.actionIcon}>↗</Text>
                </TouchableOpacity>
              )}
              {onColorChange && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: color || "#ccc" }]}
                  onPress={() => setShowColorPicker(true)}
                >
                  <Text style={styles.actionIcon}>🎨</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteActionButton]}
                  onPress={handleDeletePress}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorPicker(false)}
        >
          <View style={styles.colorPickerContainer}>
            <Text style={styles.colorPickerTitle}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorOption,
                    { backgroundColor: c },
                    color === c && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    onColorChange?.(c);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {DeleteConfirmModal}
    </View>
  );
}