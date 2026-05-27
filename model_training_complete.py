"""
SMART WAREHOUSE - COMPLETE MODEL TRAINING
Covers ALL important concepts with maximum relevant metrics
"""

# ============================================
# IMPORTS
# ============================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import *
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier

from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.svm import SVC


import warnings
warnings.filterwarnings('ignore')
import joblib
import os

# ============================================
# 1. SETUP PATHS
# ============================================
print("="*70)
print("SMART WAREHOUSE - COMPLETE MODEL TRAINING")
print("="*70)

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
data_path = os.path.join(project_root, 'data', 'cleaned_warehouse_data.csv')

# Check if file exists
if not os.path.exists(data_path):
    print(f"❌ ERROR: File not found at {data_path}")
    print("Please ensure 'cleaned_warehouse_data.csv' is in data/ folder")
    exit()

print(f"📁 Data path: {data_path}")

# ============================================
# 2. LOAD AND PREPARE DATA
# ============================================
print("\n📦 Loading and preparing data...")

# Load data
df = pd.read_csv(data_path)
print(f"✅ Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# Encode categorical columns
label_encoders = {}
for col in ['Weather_Type', 'Season_Name', 'Stockout_Risk']:
    if col in df.columns:
        le = LabelEncoder()
        df[f'{col}_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
        print(f"   Encoded: {col}")

# ============================================
# ============================================
# 3. FEATURE SELECTION
# ============================================
print("\n🎯 Selecting features...")

# Remove unnecessary + leakage columns
remove_cols = [
    'SKU_ID', 'Product_Name', 'Full_Product', 'Date', 'Expiry_Date',

    # Regression leakage
    'Outbound_Qty',
    'Daily_Sales_Units',
    'Revenue_INR',
    'Profit_INR',

    # Classification leakage
    'Days_To_Stockout',
    'Stockout_Risk'
]

features = [col for col in df.columns if col not in remove_cols and 
            not col.endswith(('_Type', '_Name', '_Risk'))]

print(f"📊 Total features selected: {len(features)}")

# ============================================
# 4. PREPARE REGRESSION DATA (Demand Forecasting)
# ============================================
print("\n📈 Preparing regression data...")

X_reg = df[features].copy()
y_reg = df['Daily_Sales_Units']

# Remove target-related columns
for col in ['Daily_Sales_Units', 'Revenue_INR', 'Profit_INR']:
    if col in X_reg.columns:
        X_reg = X_reg.drop(col, axis=1)

print(f"   Features: {X_reg.shape[1]}")
print(f"   Target range: {y_reg.min():.0f} to {y_reg.max():.0f} units")

# ============================================
# 5. PREPARE CLASSIFICATION DATA (Stockout Prediction)
# ============================================
print("\n📊 Preparing classification data...")

X_clf = X_reg.copy()

# Create target: 0=Low, 1=Medium, 2=High risk
if 'Stockout_Risk_encoded' in df.columns:
    y_clf = df['Stockout_Risk_encoded']
else:
    y_clf = np.where(df['Days_To_Stockout'] < 7, 2,
                    np.where(df['Days_To_Stockout'] < 14, 1, 0))

print(f"   Classes: Low(0), Medium(1), High(2)")
for i in range(3):
    count = (y_clf == i).sum()
    print(f"   Class {i}: {count} samples ({count/len(y_clf)*100:.1f}%)")

# ============================================
# 6. TRAIN-TEST SPLIT
# ============================================
print("\n✂️ Creating train-test split...")

X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
    X_reg, y_reg, test_size=0.2, random_state=42, shuffle=True
)

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
    X_clf, y_clf, test_size=0.2, random_state=42, shuffle=True
)

print(f"✅ Regression: Train={X_train_r.shape[0]}, Test={X_test_r.shape[0]}")
print(f"✅ Classification: Train={X_train_c.shape[0]}, Test={X_test_c.shape[0]}")

# ============================================
# 7. DEMAND FORECASTING MODEL (Regression)
# ============================================
print("\nTraining multiple regression models...")

reg_models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(n_estimators=150, max_depth=10, random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(random_state=42)
}

reg_results = {}

for name, model in reg_models.items():
    model.fit(X_train_r, y_train_r)
    preds = model.predict(X_test_r)
    
    r2 = r2_score(y_test_r, preds)
    rmse = np.sqrt(mean_squared_error(y_test_r, preds))
    mae = mean_absolute_error(y_test_r, preds)
    
    reg_results[name] = (r2, rmse, mae)
    
    print(f"\n{name}")
    print(f"R²: {r2:.4f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAE: {mae:.2f}")
# choose best model (highest R²)
best_reg_name = max(reg_results, key=lambda x: reg_results[x][0])
reg_model = reg_models[best_reg_name]

y_pred_r = reg_model.predict(X_test_r)

print(f"\nBest Regression Model: {best_reg_name}")


print("\n📊 CALCULATING ALL REGRESSION METRICS...")

# ALL IMPORTANT REGRESSION METRICS
regression_metrics = {
    # Core metrics
    'R² Score': r2_score(y_test_r, y_pred_r),
    'RMSE': np.sqrt(mean_squared_error(y_test_r, y_pred_r)),
    'MAE': mean_absolute_error(y_test_r, y_pred_r),
    'Explained Variance': explained_variance_score(y_test_r, y_pred_r),
    'Max Error': max_error(y_test_r, y_pred_r),
    
    # Time Series metrics
    'MAPE': np.nanmean(np.abs((y_test_r - y_pred_r) / y_test_r)) * 100,
}

# Add MSLE safely
try:
    regression_metrics['MSLE'] = mean_squared_log_error(y_test_r, y_pred_r)
except:
    regression_metrics['MSLE'] = np.nan

# Add MASE (Mean Absolute Scaled Error)
naive_error = np.mean(np.abs(np.diff(y_train_r)))
if naive_error > 0:
    mae = mean_absolute_error(y_test_r, y_pred_r)
    regression_metrics['MASE'] = mae / naive_error
else:
    regression_metrics['MASE'] = np.nan

# Display results
print("\n" + "-"*50)
print("REGRESSION RESULTS")
print("-"*50)
for metric, value in regression_metrics.items():
    if metric in ['RMSE', 'MAE']:
        print(f"{metric:20s}: {value:.2f} units")
    elif metric == 'MAPE':
        print(f"{metric:20s}: {value:.2f} %")
    elif metric == 'R² Score':
        print(f"{metric:20s}: {value:.4f}")
    else:
        print(f"{metric:20s}: {value:.6f}")

# ============================================
# 8. STOCKOUT PREDICTION MODEL (Classification)
# ============================================
print("\n" + "="*70)
print("STOCKOUT PREDICTION - CLASSIFICATION MODEL")
print("\nTraining multiple classification models...")

clf_models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42),
    "SVM": SVC(probability=True)
}

clf_results = {}

for name, model in clf_models.items():
    model.fit(X_train_c, y_train_c)
    preds = model.predict(X_test_c)
    
    acc = accuracy_score(y_test_c, preds)
    f1 = f1_score(y_test_c, preds, average='weighted')
    
    clf_results[name] = (acc, f1)
    
    print(f"\n{name}")
    print(f"Accuracy: {acc:.4f}")
    print(f"F1 Score: {f1:.4f}")

    # choose best model (highest accuracy)
best_clf_name = max(clf_results, key=lambda x: clf_results[x][0])
clf_model = clf_models[best_clf_name]

y_pred_c = clf_model.predict(X_test_c)
y_prob_c = clf_model.predict_proba(X_test_c)

print(f"\nBest Classification Model: {best_clf_name}")



print("\n📊 CALCULATING ALL CLASSIFICATION METRICS...")

# ALL IMPORTANT CLASSIFICATION METRICS
classification_metrics = {
    # Core metrics
    'Accuracy': accuracy_score(y_test_c, y_pred_c),
    'Log Loss': log_loss(y_test_c, y_prob_c),
    'Cohen Kappa': cohen_kappa_score(y_test_c, y_pred_c),
    
    # Multi-average metrics
    'Precision (Macro)': precision_score(y_test_c, y_pred_c, average='macro'),
    'Precision (Weighted)': precision_score(y_test_c, y_pred_c, average='weighted'),
    'Recall (Macro)': recall_score(y_test_c, y_pred_c, average='macro'),
    'Recall (Weighted)': recall_score(y_test_c, y_pred_c, average='weighted'),
    'F1 Score (Macro)': f1_score(y_test_c, y_pred_c, average='macro'),
    'F1 Score (Weighted)': f1_score(y_test_c, y_pred_c, average='weighted'),
    
    # Additional metrics
    'Hamming Loss': hamming_loss(y_test_c, y_pred_c),
    'Jaccard Score': jaccard_score(y_test_c, y_pred_c, average='weighted'),
}

# Calculate AUC-ROC for each class
try:
    auc_roc_scores = []
    for i in range(3):
        auc = roc_auc_score((y_test_c == i).astype(int), y_prob_c[:, i])
        auc_roc_scores.append(auc)
    classification_metrics['AUC-ROC (Macro)'] = np.mean(auc_roc_scores)
except:
    classification_metrics['AUC-ROC (Macro)'] = np.nan

# Calculate AUC-PR (Critical for anomaly detection)
try:
    auc_pr_scores = []
    for i in range(3):
        precision, recall, _ = precision_recall_curve(
            (y_test_c == i).astype(int), 
            y_prob_c[:, i]
        )
        auc_pr = auc(recall, precision)
        auc_pr_scores.append(auc_pr)
    classification_metrics['AUC-PR (Macro)'] = np.mean(auc_pr_scores)
except:
    classification_metrics['AUC-PR (Macro)'] = np.nan

# Calculate Matthews Correlation Coefficient
try:
    classification_metrics['MCC'] = matthews_corrcoef(y_test_c, y_pred_c)
except:
    classification_metrics['MCC'] = np.nan

# Cross-validation scores
cv_scores = cross_val_score(clf_model, X_clf, y_clf, cv=5, scoring='accuracy')
classification_metrics['CV Accuracy'] = f"{cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})"

# Display results
print("\n" + "-"*50)
print("CLASSIFICATION RESULTS")
print("-"*50)
for metric, value in classification_metrics.items():
    if isinstance(value, float):
        print(f"{metric:25s}: {value:.4f}")
    else:
        print(f"{metric:25s}: {value}")

# ============================================
# 9. CONFUSION MATRIX DETAILS
# ============================================
print("\n" + "-"*50)
print("CONFUSION MATRIX ANALYSIS")
print("-"*50)

cm = confusion_matrix(y_test_c, y_pred_c)
print(f"\nConfusion Matrix:\n{cm}")

print("\nClassification Report:")
print(classification_report(y_test_c, y_pred_c, 
                           target_names=['Low Risk', 'Medium Risk', 'High Risk']))

results_dir = os.path.join(current_dir, 'results')
if not os.path.exists(results_dir):
    os.makedirs(results_dir)


# ============================================
# 10. FEATURE IMPORTANCE ANALYSIS
# ============================================
print("\n" + "-"*50)
print("FEATURE IMPORTANCE ANALYSIS")
print("-"*50)

importance_df = pd.DataFrame({
    'Feature': X_reg.columns,
    'Importance': reg_model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\n🏆 TOP 10 MOST IMPORTANT FEATURES:")
print(importance_df.head(10).to_string(index=False))

# ============================================
# 11. SAVE MODELS AND RESULTS
# ============================================
print("\n" + "="*50)
print("REGRESSION MODEL COMPARISON")
print("="*50)

for name, (r2, rmse, mae) in reg_results.items():
    print(f"{name:20s} R²: {r2:.4f} | RMSE: {rmse:.2f} | MAE: {mae:.2f}")

print("\n" + "="*50)
print("\n" + "="*50)
print("CLASSIFICATION MODEL COMPARISON")
print("="*50)

for name, (acc, f1) in clf_results.items():
    print(f"{name:20s} Accuracy: {acc:.4f} | F1: {f1:.4f}")

# ============================================
# SAVE TRAINED MODELS
# ============================================
print("\n💾 Saving trained models...")

# Prepare model info
model_info = {
    'regression_metrics': regression_metrics,
    'classification_metrics': classification_metrics,
    'label_encoders': label_encoders
}

# Save models in current folder
joblib.dump(reg_model, 'demand_model.pkl')
joblib.dump(clf_model, 'stockout_model.pkl')
joblib.dump(model_info, 'model_info.pkl')

print("✅ Models saved:")
print("   demand_model.pkl")
print("   stockout_model.pkl")
print("   model_info.pkl")


# ============================================
# 12. CREATE VISUALIZATIONS
# ============================================
print("\n📊 Creating visualizations...")

# 1. Actual vs Predicted
plt.figure(figsize=(10, 6))
plt.scatter(y_test_r, y_pred_r, alpha=0.6, edgecolors='k', linewidth=0.5)
plt.plot([y_test_r.min(), y_test_r.max()], 
         [y_test_r.min(), y_test_r.max()], 'r--', lw=2, label='Perfect Prediction')
plt.xlabel('Actual Sales (Units)', fontsize=12)
plt.ylabel('Predicted Sales (Units)', fontsize=12)
plt.title('Demand Forecasting: Actual vs Predicted', fontsize=14, fontweight='bold')
plt.grid(True, alpha=0.3)
plt.legend()
plt.savefig(os.path.join(results_dir, 'demand_forecasting.png'), 
            dpi=300, bbox_inches='tight')

# 2. Confusion Matrix Heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Low', 'Medium', 'High'],
            yticklabels=['Low', 'Medium', 'High'])
plt.xlabel('Predicted Risk Level', fontsize=12)
plt.ylabel('Actual Risk Level', fontsize=12)
plt.title('Stockout Risk Prediction - Confusion Matrix', fontsize=14, fontweight='bold')
plt.savefig(os.path.join(results_dir, 'confusion_matrix.png'), 
            dpi=300, bbox_inches='tight')

# 3. Feature Importance Bar Chart
plt.figure(figsize=(12, 8))
top_features = importance_df.head(15)
colors = plt.cm.viridis(np.linspace(0, 1, len(top_features)))
plt.barh(top_features['Feature'], top_features['Importance'], color=colors)
plt.xlabel('Feature Importance Score', fontsize=12)
plt.title('Top 15 Features for Demand Forecasting', fontsize=14, fontweight='bold')
plt.gca().invert_yaxis()
plt.grid(axis='x', alpha=0.3)
plt.savefig(os.path.join(results_dir, 'feature_importance.png'), 
            dpi=300, bbox_inches='tight')

print("✅ Visualizations saved in 'results' folder")

# ============================================
# 13. GENERATE FINAL REPORT
# ============================================
print("\n📝 Generating final report...")

report_path = os.path.join(results_dir, 'model_performance_report.txt')
with open(report_path, 'w') as f:
    f.write("="*60 + "\n")
    f.write("SMART WAREHOUSE - MODEL PERFORMANCE REPORT\n")
    f.write("="*60 + "\n\n")
    
    f.write("1. DEMAND FORECASTING MODEL (Regression)\n")
    f.write("-"*40 + "\n")
    for metric, value in regression_metrics.items():
        f.write(f"{metric:20s}: {value}\n")
    
    f.write("\n2. STOCKOUT PREDICTION MODEL (Classification)\n")
    f.write("-"*40 + "\n")
    for metric, value in classification_metrics.items():
        f.write(f"{metric:25s}: {value}\n")
    
    f.write("\n3. TOP 5 FEATURES\n")
    f.write("-"*40 + "\n")
    for i, row in importance_df.head().iterrows():
        f.write(f"{i+1}. {row['Feature']}: {row['Importance']:.4f}\n")
    
    f.write("\n4. CONFUSION MATRIX\n")
    f.write("-"*40 + "\n")
    f.write(f"{cm}\n")

print("✅ Report saved: results/model_performance_report.txt")

# ============================================
# 14. FINAL SUMMARY
# ============================================
print("\n" + "="*70)
print("TRAINING COMPLETE - SUMMARY")
print("="*70)

print(f"\n✅ MODELS TRAINED:")
print(f"   1. Demand Forecasting - R²: {regression_metrics['R² Score']:.4f}")
print(f"   2. Stockout Prediction - Accuracy: {classification_metrics['Accuracy']:.4f}")

print(f"\n📊 KEY METRICS FOR PRESENTATION:")
print(f"   • Demand Forecasting Error (MAPE): {regression_metrics['MAPE']:.1f}%")
print(f"   • Stockout Prediction Accuracy: {classification_metrics['Accuracy']:.2%}")
print(f"   • AUC-PR (Anomaly Detection): {classification_metrics.get('AUC-PR (Macro)', 'N/A'):.4f}")
print(f"   • Feature Importance: {importance_df.iloc[0]['Feature']} is most important")

print(f"\n📁 FILES CREATED:")
print(f"   backend/demand_model.pkl")
print(f"   backend/stockout_model.pkl")
print(f"   backend/model_info.pkl")
print(f"   backend/results/ (3 graphs + report)")

print("\n" + "="*70)
# print("🎯 READY FOR PRESENTATION & DEMO!")
print("="*70)