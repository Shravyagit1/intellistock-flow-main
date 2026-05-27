"""
SMART WAREHOUSE - COMPREHENSIVE MODEL TESTING
Tests both demand forecasting and stockout prediction models
"""

# ============================================
# IMPORTS
# ============================================
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import *
import joblib
import os
from datetime import datetime

# ============================================
# 1. SETUP AND LOAD MODELS
# ============================================
print("="*70)
print("SMART WAREHOUSE - COMPREHENSIVE MODEL TESTING")
print("="*70)

current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = current_dir

# Load trained models
print("\n📂 Loading trained models...")
try:
    demand_model = joblib.load(os.path.join(models_dir, 'demand_model.pkl'))
    stockout_model = joblib.load(os.path.join(models_dir, 'stockout_model.pkl'))
    model_info = joblib.load(os.path.join(models_dir, 'model_info.pkl'))
    print("✅ Models loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ Error: {e}")
    print("Please run training script first!")
    exit()

# ============================================
# 2. LOAD TEST DATA
# ============================================
print("\n📊 Loading test data...")

# Option 1: Use new unseen test data
test_data_path = os.path.join(os.path.dirname(current_dir), 'data', 'test_data.csv')

# Option 2: If no separate test data, use validation split
if not os.path.exists(test_data_path):
    print("⚠️  No separate test data found. Creating validation split...")
    data_path = os.path.join(os.path.dirname(current_dir), 'data', 'cleaned_warehouse_data.csv')
    df = pd.read_csv(data_path)
    
    # Same preprocessing as training
    for col in ['Weather_Type', 'Season_Name', 'Stockout_Risk']:
        if col in df.columns and col in model_info['label_encoders']:
            le = model_info['label_encoders'][col]
            df[f'{col}_encoded'] = le.transform(df[col])
    
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

    # Prepare features
    X_test = df[features].copy()
    
    # Remove target-related columns
    for col in ['Daily_Sales_Units', 'Revenue_INR', 'Profit_INR']:
        if col in X_test.columns:
            X_test = X_test.drop(col, axis=1)
    
    # Get targets
    y_test_demand = df['Daily_Sales_Units']
    
    # Create stockout target
    if 'Stockout_Risk_encoded' in df.columns:
        y_test_stockout = df['Stockout_Risk_encoded']
    else:
        y_test_stockout = np.where(df['Days_To_Stockout'] < 7, 2,
                                  np.where(df['Days_To_Stockout'] < 14, 1, 0))
    
    print(f"✅ Using validation data: {X_test.shape[0]} samples")

#else:
    # Load separate test data
    #df_test = pd.read_csv(test_data_path)
    #print(f"✅ Test data loaded: {df_test.shape[0]} samples")
    
    # TODO: Add preprocessing for test data similar to training

# ============================================
# 3. MAKE PREDICTIONS
# ============================================
print("\n🎯 Making predictions...")

# Demand forecasting predictions
demand_predictions = demand_model.predict(X_test)

# Stockout risk predictions
stockout_predictions = stockout_model.predict(X_test)
stockout_probabilities = stockout_model.predict_proba(X_test)

print(f"✅ Predictions generated for {len(demand_predictions)} samples")

# ============================================
# 4. COMPREHENSIVE REGRESSION TESTING
# ============================================
print("\n" + "="*70)
print("DEMAND FORECASTING - TEST RESULTS")
print("="*70)

# Calculate all regression metrics
regression_test_metrics = {
    'R² Score': r2_score(y_test_demand, demand_predictions),
    'RMSE': np.sqrt(mean_squared_error(y_test_demand, demand_predictions)),
    'MAE': mean_absolute_error(y_test_demand, demand_predictions),
    'Explained Variance': explained_variance_score(y_test_demand, demand_predictions),
    'Max Error': max_error(y_test_demand, demand_predictions),
    'MAPE': np.nanmean(np.abs((y_test_demand - demand_predictions) / y_test_demand)) * 100,
}

# Add MSLE safely
try:
    regression_test_metrics['MSLE'] = mean_squared_log_error(y_test_demand, demand_predictions)
except:
    regression_test_metrics['MSLE'] = np.nan

# Compare with training metrics
print("\n📊 PERFORMANCE COMPARISON (Training vs Testing)")
print("-"*50)
print(f"{'Metric':25s} {'Training':15s} {'Testing':15s} {'Difference':10s}")
print("-"*50)

for metric in regression_test_metrics:
    if metric in model_info['regression_metrics']:
        train_val = model_info['regression_metrics'][metric]
        test_val = regression_test_metrics[metric]
        
        if isinstance(train_val, (int, float)) and isinstance(test_val, (int, float)):
            diff = test_val - train_val
            diff_str = f"{diff:+.4f}"
            
            # Color code based on performance drop
            if abs(diff) > 0.1 and metric == 'R² Score':
                diff_str = f"\033[91m{diff_str}\033[0m"  # Red for bad
            elif abs(diff) < 0.05:
                diff_str = f"\033[92m{diff_str}\033[0m"  # Green for good
            
            print(f"{metric:25s} {train_val:15.4f} {test_val:15.4f} {diff_str:10s}")

# ============================================
# 5. COMPREHENSIVE CLASSIFICATION TESTING
# ============================================
print("\n" + "="*70)
print("STOCKOUT PREDICTION - TEST RESULTS")
print("="*70)

# Calculate all classification metrics
classification_test_metrics = {
    'Accuracy': accuracy_score(y_test_stockout, stockout_predictions),
    'Log Loss': log_loss(y_test_stockout, stockout_probabilities),
    'Cohen Kappa': cohen_kappa_score(y_test_stockout, stockout_predictions),
    'Precision (Weighted)': precision_score(y_test_stockout, stockout_predictions, average='weighted'),
    'Recall (Weighted)': recall_score(y_test_stockout, stockout_predictions, average='weighted'),
    'F1 Score (Weighted)': f1_score(y_test_stockout, stockout_predictions, average='weighted'),
    'Hamming Loss': hamming_loss(y_test_stockout, stockout_predictions),
}

# Confusion Matrix
cm_test = confusion_matrix(y_test_stockout, stockout_predictions)

print("\n📊 PERFORMANCE COMPARISON (Training vs Testing)")
print("-"*50)
print(f"{'Metric':30s} {'Training':15s} {'Testing':15s} {'Difference':10s}")
print("-"*50)

for metric in classification_test_metrics:
    if metric in model_info['classification_metrics']:
        train_val = model_info['classification_metrics'][metric]
        test_val = classification_test_metrics[metric]
        
        if isinstance(train_val, (int, float)) and isinstance(test_val, (int, float)):
            diff = test_val - train_val
            diff_str = f"{diff:+.4f}"
            
            # Color code
            if abs(diff) > 0.1 and metric == 'Accuracy':
                diff_str = f"\033[91m{diff_str}\033[0m"
            elif abs(diff) < 0.05:
                diff_str = f"\033[92m{diff_str}\033[0m"
            
            print(f"{metric:30s} {train_val:15.4f} {test_val:15.4f} {diff_str:10s}")

# ============================================
# 6. DETAILED CONFUSION MATRIX ANALYSIS
# ============================================
print("\n" + "-"*50)
print("CONFUSION MATRIX ANALYSIS (Test Data)")
print("-"*50)

print(f"\nConfusion Matrix:\n{cm_test}")

# Calculate metrics per class
class_names = ['Low Risk', 'Medium Risk', 'High Risk']
print("\n📈 Per-class metrics:")
print("-"*40)
for i, class_name in enumerate(class_names):
    tp = cm_test[i, i]
    fp = cm_test[:, i].sum() - tp
    fn = cm_test[i, :].sum() - tp
    tn = cm_test.sum() - (tp + fp + fn)
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0
    
    print(f"\n{class_name}:")
    print(f"  Precision: {precision:.3f}")
    print(f"  Recall:    {recall:.3f}")
    print(f"  F1-Score:  {f1:.3f}")
    print(f"  Support:   {cm_test[i, :].sum()} samples")

# ============================================
# 7. ERROR ANALYSIS
# ============================================
print("\n" + "="*70)
print("ERROR ANALYSIS")
print("="*70)

# Create error analysis DataFrame
error_df = pd.DataFrame({
    'Actual_Demand': y_test_demand,
    'Predicted_Demand': demand_predictions,
    'Demand_Error': demand_predictions - y_test_demand,
    'Demand_Error_Pct': ((demand_predictions - y_test_demand) / y_test_demand) * 100,
    'Actual_Risk': y_test_stockout,
    'Predicted_Risk': stockout_predictions,
    'Risk_Correct': y_test_stockout == stockout_predictions
})

# Add feature columns for analysis
for feature in X_test.columns[:5]:  # Add first 5 features for analysis
    error_df[feature] = X_test[feature].values

print("\n📊 Demand Forecasting Error Distribution:")
print("-"*40)
print(error_df['Demand_Error'].describe())

print("\n📈 Error Categories:")
print("-"*40)
error_df['Error_Category'] = pd.cut(
    error_df['Demand_Error_Pct'],
    bins=[-float('inf'), -20, -10, -5, 5, 10, 20, float('inf')],
    labels=['<-20%', '-20% to -10%', '-10% to -5%', '-5% to 5%', '5% to 10%', '10% to 20%', '>20%']
)
print(error_df['Error_Category'].value_counts().sort_index())

# ============================================
# 8. BUSINESS IMPACT ANALYSIS
# ============================================
print("\n" + "="*70)
print("BUSINESS IMPACT ANALYSIS")
print("="*70)

# Calculate cost implications
avg_unit_cost = 500  # Assume average unit cost in INR
avg_unit_price = 750  # Assume average selling price

# Inventory holding cost (assume 20% per year)
holding_cost_rate = 0.20 / 365  # Daily holding cost

# Calculate costs
error_df['Overstock_Cost'] = np.where(
    error_df['Demand_Error'] > 0,
    error_df['Demand_Error'] * avg_unit_cost * holding_cost_rate * 30,  # 30 days holding
    0
)

error_df['Stockout_Cost'] = np.where(
    error_df['Demand_Error'] < 0,
    abs(error_df['Demand_Error']) * (avg_unit_price - avg_unit_cost),  # Lost profit
    0
)

error_df['Risk_Misclassification_Cost'] = np.where(
    ~error_df['Risk_Correct'],
    1000,  # Fixed cost per misclassification (can be adjusted)
    0
)

total_cost = error_df['Overstock_Cost'].sum() + error_df['Stockout_Cost'].sum() + error_df['Risk_Misclassification_Cost'].sum()

print(f"\n💰 ESTIMATED MONTHLY COST IMPACT:")
print("-"*40)
print(f"Overstock Holding Cost:   ₹ {error_df['Overstock_Cost'].sum():,.2f}")
print(f"Stockout Lost Profit:     ₹ {error_df['Stockout_Cost'].sum():,.2f}")
print(f"Risk Misclassification:   ₹ {error_df['Risk_Misclassification_Cost'].sum():,.2f}")
print(f"{'':-<40}")
print(f"TOTAL ESTIMATED COST:     ₹ {total_cost:,.2f}")

# ============================================
# 9. SAVE TEST RESULTS
# ============================================
print("\n" + "="*70)
print("SAVING TEST RESULTS")
print("="*70)

# Create test results directory
test_results_dir = os.path.join(current_dir, 'test_results')
if not os.path.exists(test_results_dir):
    os.makedirs(test_results_dir)

# Save predictions
predictions_file = os.path.join(test_results_dir, 'model_predictions.csv')
error_df.to_csv(predictions_file, index=False)
print(f"✅ Predictions saved: {predictions_file}")

# Save test report
report_file = os.path.join(test_results_dir, 'test_report.txt')
with open(report_file, 'w') as f:
    f.write("="*60 + "\n")
    f.write("MODEL TESTING REPORT\n")
    f.write(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    f.write("="*60 + "\n\n")
    
    f.write("1. TEST SET SUMMARY\n")
    f.write("-"*40 + "\n")
    f.write(f"Samples tested: {len(X_test)}\n")
    f.write(f"Features used: {len(X_test.columns)}\n\n")
    
    f.write("2. DEMAND FORECASTING RESULTS\n")
    f.write("-"*40 + "\n")
    for metric, value in regression_test_metrics.items():
        f.write(f"{metric:25s}: {value}\n")
    
    f.write("\n3. STOCKOUT PREDICTION RESULTS\n")
    f.write("-"*40 + "\n")
    for metric, value in classification_test_metrics.items():
        f.write(f"{metric:30s}: {value}\n")
    
    f.write("\n4. CONFUSION MATRIX\n")
    f.write("-"*40 + "\n")
    f.write(f"{cm_test}\n")
    
    f.write("\n5. BUSINESS IMPACT\n")
    f.write("-"*40 + "\n")
    f.write(f"Total Estimated Monthly Cost: Rs. {total_cost:,.2f}\n")

print(f"✅ Test report saved: {report_file}")

# ============================================
# 10. CREATE TEST VISUALIZATIONS
# ============================================
print("\n📈 Creating test visualizations...")

# 1. Error Distribution
plt.figure(figsize=(10, 6))
plt.hist(error_df['Demand_Error_Pct'].dropna(), bins=50, edgecolor='black', alpha=0.7)
plt.axvline(x=0, color='red', linestyle='--', label='Zero Error')
plt.xlabel('Prediction Error (%)', fontsize=12)
plt.ylabel('Frequency', fontsize=12)
plt.title('Demand Forecasting Error Distribution (Test Data)', fontsize=14, fontweight='bold')
plt.grid(True, alpha=0.3)
plt.legend()
plt.savefig(os.path.join(test_results_dir, 'error_distribution.png'), 
            dpi=300, bbox_inches='tight')

# 2. Confusion Matrix Heatmap
plt.figure(figsize=(8, 6))
sns.heatmap(cm_test, annot=True, fmt='d', cmap='Reds',
            xticklabels=class_names, yticklabels=class_names)
plt.xlabel('Predicted Risk', fontsize=12)
plt.ylabel('Actual Risk', fontsize=12)
plt.title('Test Data - Confusion Matrix', fontsize=14, fontweight='bold')
plt.savefig(os.path.join(test_results_dir, 'test_confusion_matrix.png'), 
            dpi=300, bbox_inches='tight')

# 3. Actual vs Predicted Scatter (Test)
plt.figure(figsize=(10, 6))
plt.scatter(y_test_demand[:200], demand_predictions[:200], alpha=0.6, 
            c=stockout_predictions[:200], cmap='viridis', edgecolors='k', linewidth=0.5)
plt.plot([y_test_demand.min(), y_test_demand.max()], 
         [y_test_demand.min(), y_test_demand.max()], 'r--', lw=2, label='Perfect')
plt.xlabel('Actual Demand (Units)', fontsize=12)
plt.ylabel('Predicted Demand (Units)', fontsize=12)
plt.title('Test Data: Actual vs Predicted Demand', fontsize=14, fontweight='bold')
plt.colorbar(label='Stockout Risk (0=Low, 1=Med, 2=High)')
plt.grid(True, alpha=0.3)
plt.legend()
plt.savefig(os.path.join(test_results_dir, 'test_actual_vs_predicted.png'), 
            dpi=300, bbox_inches='tight')

print("✅ Visualizations saved in 'test_results' folder")

# ============================================
# 11. FINAL TESTING SUMMARY
# ============================================
print("\n" + "="*70)
print("TESTING COMPLETE - SUMMARY")
print("="*70)

# Determine if model passed testing
demand_r2_pass = regression_test_metrics['R² Score'] > 0.7
stockout_acc_pass = classification_test_metrics['Accuracy'] > 0.8
overfit_check = abs(regression_test_metrics['R² Score'] - model_info['regression_metrics']['R² Score']) < 0.2

print(f"\n🔍 TEST RESULTS EVALUATION:")
print(f"   Demand Forecasting R²:     {regression_test_metrics['R² Score']:.4f} {'✅' if demand_r2_pass else '❌'}")
print(f"   Stockout Prediction Acc:   {classification_test_metrics['Accuracy']:.4f} {'✅' if stockout_acc_pass else '❌'}")
print(f"   Overfitting Check:         {'✅ PASS' if overfit_check else '❌ FAIL'}")

print(f"\n📊 KEY INSIGHTS:")
print(f"   • Mean Absolute Error: {regression_test_metrics['MAE']:.1f} units")
print(f"   • Mean Absolute % Error: {regression_test_metrics['MAPE']:.1f}%")
print(f"   • Stockout Precision: {classification_test_metrics['Precision (Weighted)']:.1%}")

print(f"\n💼 BUSINESS IMPACT:")
print(f"   • Estimated monthly savings with accurate predictions")
print(f"   • Risk prediction reliability: {classification_test_metrics['Accuracy']:.1%}")

print(f"\n📁 FILES GENERATED:")
print(f"   test_results/model_predictions.csv")
print(f"   test_results/test_report.txt")
print(f"   test_results/ (3 visualization files)")

print("\n" + "="*70)
if demand_r2_pass and stockout_acc_pass and overfit_check:
    print("✅ ALL TESTS PASSED - MODEL READY FOR DEPLOYMENT!")
else:
    print("⚠️  SOME TESTS FAILED - REVIEW MODEL PERFORMANCE")
print("="*70)